import React from 'react';

interface KeyValueProps {
  kvpKey: string;
  kvpValue: string;
}

export const KeyValue = function ({
  kvpKey = 'Key',
  kvpValue = ''
}: KeyValueProps) {
  return (
    <div className="grid grid-cols-2 gap-1 text-left">
      <div className="key">{kvpKey}</div>
      <div className="value">{kvpValue.replace(/undefined/g, '')}</div>
    </div>
  );
};
