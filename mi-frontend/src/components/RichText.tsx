'use client';

import React from 'react';
import { Typography, Box, Link as MuiLink, SxProps, Theme, colors } from '@mui/material';
import { inherits } from 'util';

type RichTextNode = {
  type?: string;
  text?: string;
  children?: RichTextNode[];
  url?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
  [key: string]: any;
};

interface Props {
  content?: RichTextNode[];
  sx?: SxProps<Theme>;
  className?: string;
}

const RichText: React.FC<Props> = ({ content = [], sx, className }) => {
  const renderNode = (node: RichTextNode, index: number): React.ReactNode => {
    const key = `node-${index}`;

    if (node.type === 'text' || (!node.type && node.text)) {
      let text = node.text || '';
      if (!text.trim()) return null;

      let styledText: React.ReactNode = text;
      if (node.bold) styledText = <strong>{styledText}</strong>;
      if (node.italic) styledText = <em>{styledText}</em>;
      if (node.underline) styledText = <u>{styledText}</u>;
      if (node.code) styledText = <code>{styledText}</code>;

      return <React.Fragment key={key}>{styledText}</React.Fragment>;
    }

    const children = (node.children || []).map(renderNode);

    switch (node.type) {
      case 'paragraph':
        return (
          <Typography key={key} component="p" paragraph>
            {children}
          </Typography>
        );
      case 'heading-one':
        return (
          <Typography key={key} variant="h4" component="h1" gutterBottom>
            {children}
          </Typography>
        );
      case 'heading-two':
        return (
          <Typography key={key} variant="h5" component="h2" gutterBottom>
            {children}
          </Typography>
        );
      case 'heading-three':
        return (
          <Typography key={key} variant="h6" component="h3" gutterBottom>
            {children}
          </Typography>
        );
      case 'bulleted-list':
        return <Box key={key} component="ul" >{children}</Box>;
      case 'numbered-list':
        return <Box key={key} component="ol">{children}</Box>;
      case 'list-item':
        return <Box key={key} component="li" sx={{textAlign:'justify', marginBottom:'1rem', lineHeight:'1.5rem', textIndent:'-1.3em', paddingLeft:'1.3em'}}>{children}</Box>;
      case 'quote':
        return (
          <Typography
            key={key}
            component="blockquote"
            sx={{ fontStyle: 'italic', borderLeft: '4px solid #ccc', pl: 2, my: 2 }}
          >
            {children}
          </Typography>
        );
      case 'link':
        return (
          <MuiLink key={key} href={node.url} target="_blank" rel="noopener noreferrer">
            {children}
          </MuiLink>
        );
      case 'code-block':
        return (
          <Box key={key} component="pre" sx={{ backgroundColor: '#f5f5f5', p: 2, my: 2 }}>
            <code>{children}</code>
          </Box>
        );
      default:
        return <React.Fragment key={key}>{children}</React.Fragment>;
    }
  };

  return (
    <Box sx={sx} className={className}>
      {content.map((node, index) => renderNode(node, index))}
    </Box>
  );
};

export default RichText;
