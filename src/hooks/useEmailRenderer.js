import { sanitizeEmailContent, detectTemplateType, extractTextPreview } from '../services/email/adminEmailService';

/**
 * Hook for rendering and processing email HTML content
 * Handles template detection, sanitization, and preview extraction
 */
export const useEmailRenderer = (htmlContent) => {
  // Sanitize and prepare HTML
  const sanitized = sanitizeEmailContent(htmlContent);
  
  // Get template type
  const templateType = detectTemplateType(htmlContent);
  
  // Extract text preview
  const textPreview = extractTextPreview(htmlContent);
  
  // Check if content has images
  const hasImages = /<img[^>]*>/i.test(htmlContent);
  
  // Check if content has tables
  const hasTables = /<table[^>]*>/i.test(htmlContent);
  
  // Extract links count
  const linkCount = (htmlContent.match(/<a[^>]*>/g) || []).length;
  
  return {
    // Sanitized HTML safe for rendering
    safeHtml: sanitized.html,
    
    // Original HTML for reference
    originalHtml: htmlContent,
    
    // Whether content is a template with variables
    isTemplate: sanitized.isTemplate,
    
    // Detected template type
    templateType,
    
    // Text preview (first 100 chars)
    preview: textPreview,
    
    // Content features
    features: {
      hasImages,
      hasTables,
      linkCount,
      isEmpty: !htmlContent || htmlContent.trim() === ''
    },
    
    /**
     * Render email with optional custom styling
     * @param {Object} options - { className, style, wrapInIframe }
     * @returns {Object} - { html, css }
     */
    render: (options = {}) => {
      const { className = 'email-body', style = {}, wrapInIframe = false } = options;
      
      const styleString = Object.entries(style)
        .map(([key, value]) => `${key}: ${value}`)
        .join('; ');
      
      const htmlWithWrapper = `
        <div class="${className}" ${styleString ? `style="${styleString}"` : ''}>
          ${sanitized.html}
        </div>
      `;
      
      return {
        html: htmlWithWrapper,
        css: getEmailCss(templateType)
      };
    },
    
    /**
     * Get template-specific styling
     */
    getTemplateStyles: () => getEmailCss(templateType),
    
    /**
     * Check if email needs approval before sending
     */
    needsApproval: () => {
      return sanitized.isTemplate && !sanitized.isTemplate.includes('{{'); // Incomplete template
    }
  };
};

/**
 * Get template-specific CSS for email rendering
 * @param {string} templateType - Type of template
 * @returns {string} - CSS styles
 */
export const getEmailCss = (templateType) => {
  const baseCss = `
    .email-body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      word-break: break-word;
    }
    
    .email-body h1, .email-body h2, .email-body h3 {
      margin: 20px 0 15px 0;
      color: #222;
    }
    
    .email-body p {
      margin: 10px 0;
    }
    
    .email-body a {
      color: #667eea;
      text-decoration: none;
    }
    
    .email-body a:hover {
      text-decoration: underline;
    }
    
    .email-body img {
      max-width: 100%;
      height: auto;
      margin: 15px 0;
      border-radius: 4px;
    }
    
    .email-body table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }
    
    .email-body th,
    .email-body td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    
    .email-body th {
      background: #f5f5f5;
      font-weight: 600;
      color: #222;
    }
    
    .email-body tr:hover {
      background: #f9f9f9;
    }
    
    .email-body blockquote {
      margin: 15px 0;
      padding-left: 15px;
      border-left: 3px solid #667eea;
      color: #666;
    }
    
    .email-body code {
      background: #f5f5f5;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 0.9em;
    }
    
    .email-body pre {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 4px;
      overflow-x: auto;
      margin: 15px 0;
    }
    
    .email-body ul, .email-body ol {
      margin: 10px 0;
      padding-left: 30px;
    }
    
    .email-body li {
      margin: 5px 0;
    }
  `;
  
  // Template-specific styles
  const templateStyles = {
    orderConfirmation: `
      .order-item { background: #f9f9f9; padding: 10px; margin: 5px 0; border-radius: 3px; }
      .order-total { font-size: 18px; font-weight: 600; color: #667eea; }
      .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    `,
    orderStatus: `
      .status-box { padding: 15px; border-left: 4px solid #667eea; background: #f8f9fa; margin: 10px 0; }
      .status-label { font-weight: 600; color: #222; }
      .status-value { color: #666; margin-top: 5px; }
    `,
    vendorApplication: `
      .app-section { margin: 15px 0; padding: 15px; background: #f5f5f5; border-radius: 4px; }
      .app-label { font-weight: 600; color: #222; font-size: 12px; text-transform: uppercase; }
      .app-value { color: #333; margin-top: 5px; }
    `,
    general: baseCss
  };
  
  return baseCss + (templateStyles[templateType] || '');
};

/**
 * Extract email metadata from HTML
 * @param {string} htmlContent - HTML content
 * @returns {Object} - Metadata
 */
export const extractEmailMetadata = (htmlContent) => {
  const metadata = {
    wordCount: 0,
    imageCount: 0,
    linkCount: 0,
    tableCount: 0,
    estimatedReadTime: 0
  };
  
  // Count words (rough estimate)
  const textContent = htmlContent.replace(/<[^>]*>/g, '');
  metadata.wordCount = textContent.split(/\s+/).length;
  
  // Count images
  metadata.imageCount = (htmlContent.match(/<img[^>]*>/g) || []).length;
  
  // Count links
  metadata.linkCount = (htmlContent.match(/<a[^>]*>/g) || []).length;
  
  // Count tables
  metadata.tableCount = (htmlContent.match(/<table[^>]*>/g) || []).length;
  
  // Estimate read time (200 words per minute)
  metadata.estimatedReadTime = Math.max(1, Math.ceil(metadata.wordCount / 200));
  
  return metadata;
};

export default useEmailRenderer;
