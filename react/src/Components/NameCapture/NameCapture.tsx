import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { answerQuestion } from 'slices/dataSlice';
import { Typography } from 'Components/Typography/Typography';
import { Input } from 'Components/Input/Input';

export interface NameCaptureProps {
  answer?: string,
}

export const NameCapture = function ({
  answer,
  ...props
}: NameCaptureProps) {
  const dispatch = useDispatch();
  const [value, setValue] = useState(answer ?? '');
  useEffect(() => {
    setTimeout(() => {
      const input: HTMLInputElement | null = document.querySelector("#input");
      input?.focus();
    }, 500);


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateValue(value: string) {
    setValue(value)
    dispatch(answerQuestion({ answerIndex: 0, value: value?.trim() }));
  }

  return (
    <div className='text-left'>
      <Typography usage='headingMedium' content='What’s your name?' typeClass={['mb-4']} />
      <Input id='input' type='text' value={value} onChange={e => updateValue(e.target.value)} />
    </div>
  );
};
