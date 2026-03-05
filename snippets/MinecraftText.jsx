{
  /*
   * Base: https://github.com/iwillreku3206/minecraft-formatted-text-react
   */
}

import React, { useState, useEffect } from 'react';

export const colours =
  {
    '0': '#000000',
    '1': '#0000AA',
    '2': '#00AA00',
    '3': '#00AAAA',
    '4': '#AA0000',
    '5': '#AA00AA',
    '6': '#FFAA00',
    '7': '#AAAAAA',
    '8': '#555555',
    '9': '#5555FF',
    'a': '#55FF55',
    'b': '#55FFFF',
    'c': '#FF5555',
    'd': '#FF55FF',
    'e': '#FFFF55',
    'f': '#FFFFFF'
  };

export const chars =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!§$%&?#';

export const ObfuscatedText = ({ text, style }) => {

  const [ glitchText, setGlitchText ] = useState(text);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchText(
        text.split('')
          .map(
            (char) => (char === ' ') ?
              ' ' : chars[Math.floor(Math.random() * chars.length)]
          )
          .join('')
      );
    }, 50);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span style={{ ...style, whiteSpace: 'nowrap' }}>
      {
        glitchText.split('')
          .map((char, index) => (
            <span 
              key={ index } 
              style={{
                display: 'inline-block',
                width: '1ch',
                textAlign: 'center'
              }}
            > { char } </span>
          ))
      }
    </span>
  );

};

export const MinecraftText = ({
  text,
  prefix = '§',
  cssStyle = {},
  children
}) => {

  let raw = text || "";
  if (!raw && children)
    raw = (typeof children === 'string') ?
      children : String(children);

  let string = "";
  const segments = [];

  let style = {
    color: '#FFFFFF',
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    obfuscated: false
  };

  for (let i = 0; i < raw.length; i++) {

    if (raw[i] !== prefix || i + 1 >= raw.length) {
      string += raw[i];
      continue;
    }

    if (string) {
      segments.push({ text: string, ...style });
      string = "";
    }

    const code = raw[i + 1].toLowerCase();
    i++;

    switch (code) {

      case 'l':
        style.bold = true;
        break;

      case 'o':
        style.italic = true;
        break;

      case 'n':
        style.underline = true;
        break;

      case 'm':
        style.strikethrough = true;
        break;

      case 'k':
        style.obfuscated = true;
        break;

      case 'r':
        style.color = '#FFFFFF';
        style.bold = false;
        style.italic = false;
        style.underline = false;
        style.strikethrough = false;
        style.obfuscated = false;
        break;

      default:

        if (!colours[code])
          break;

        style.color = colours[code];
        style.bold = false;
        style.italic = false;
        style.underline = false;
        style.strikethrough = false;
        style.obfuscated = false;
        break;

    }
    
  }

  if (string)
    segments.push({ text: string, ...style });

  return (
    <div style={{
      fontFamily: '"Minecraftia", monospace',
      textShadow: '2px 2px 0px #383838',
      ...cssStyle
    }}>

      <style>
      {`
        @import url('https://fonts.cdnfonts.com/css/minecraftia');
      `}
      </style>

      {

        segments.map((segment, idx) => {

          const css = {
            color: segment.color,
            fontWeight: (segment.bold) ?
              'bold' : 'normal',
            fontStyle: (segment.italic) ?
              'italic' : 'normal',
            textDecoration: [
              (segment.underline) ?
                'underline' : '',
              (segment.strikethrough) ?
                'line-through' : ''
            ].filter(Boolean).join(' ') || 'none',
          };

          if (segment.obfuscated)
            return (
              <ObfuscatedText
                key={ idx }
                text={ segment.text }
                style={ css }
              />
            );

          return (
            <span
              key={ idx }
              style={ css }
            >{ segment.text }</span>
          );

        })
      }
    </div>
  );
  
};