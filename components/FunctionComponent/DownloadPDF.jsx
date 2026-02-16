'use client';

import { forwardRef, useImperativeHandle, useState, useCallback } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const DownloadPDF = forwardRef(({
    resumeData,
    template,
    filename,
    variant = 'default',
    size = 'default',
    showIcon = true,
    showLabel = true,
    label = 'Download PDF',
    iconOnly = false,
    className = '',
    onBeforeDownload,
    onAfterDownload,
    onError,
    disabled = false,
}, ref) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const { toast } = useToast();

    useImperativeHandle(ref, () => ({
        download: handleDownload
    }));

    const handleDownload = useCallback(async () => {
        if (isDownloading || disabled || !resumeData) {
            console.log('Download prevented:', { isDownloading, disabled, hasData: !!resumeData });
            return;
        }

        setIsDownloading(true);
        onBeforeDownload?.();

        try {
            toast({
                title: "📄 Generating PDF",
                description: "Please wait...",
            });

            console.log('Sending PDF request with template:', template);

            // Call your backend API
            const response = await fetch('http://localhost:5001/api/pdf/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    resumeData,
                    template: template || 'modern'
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to generate PDF');
            }

            // Get the PDF blob
            const blob = await response.blob();

            if (blob.size === 0) {
                throw new Error('Generated PDF is empty');
            }

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename || `${resumeData.full_name || 'resume'}-${template || 'modern'}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast({
                title: "✅ Success",
                description: "PDF downloaded successfully",
            });
            onAfterDownload?.();

        } catch (error) {
            console.error('PDF Download Error:', error);
            toast({
                title: "❌ Failed",
                description: error.message || "Could not generate PDF. Please try again.",
                variant: "destructive",
            });
            onError?.(error);
        } finally {
            setIsDownloading(false);
        }
    }, [isDownloading, disabled, filename, resumeData, template, toast, onBeforeDownload, onAfterDownload, onError]);

    return (
        <Button
            variant={variant}
            size={size}
            onClick={handleDownload}
            disabled={disabled || isDownloading || !resumeData}
            className={className}
        >
            {isDownloading ? (
                <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {!iconOnly && showLabel && <span>Generating...</span>}
                </>
            ) : (
                <>
                    {showIcon && <Download className={`w-4 h-4 ${iconOnly ? '' : 'mr-2'}`} />}
                    {!iconOnly && showLabel && <span>{label}</span>}
                </>
            )}
        </Button>
    );
});

DownloadPDF.displayName = 'DownloadPDF';

export default DownloadPDF;