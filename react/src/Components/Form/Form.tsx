import './Form.scss';
import { Button } from 'Components/Button/Button';
import { Input, InputProps } from 'Components/Input/Input';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ListItem } from 'Components/ListItem/ListItem';
import { ListGroup } from 'Components/ListGroup/ListGroup';

export interface FormProps {
  onSubmit?: any;
  valuesOnSubmit?: boolean;
  hideCancel?: boolean;
  onCancel?: any;
  submitLabel?: string;
  cancelLabel?: string;
  inputFields?: InputProps[];
  loading?: boolean;
  children?: React.ReactNode;
  errorMessage?: any;
  childrenPosition?: 'top' | 'bottom';
}

export const Form = function ({
  hideCancel = false,
  childrenPosition = 'bottom',
  loading = false,
  ...props
}: FormProps) {
  const navigate = useNavigate();
  const [inputFields, setInputFields] = useState(props.inputFields);
  const [error, setError] = useState('');
  const [complete, setComplete] = useState(false);
  const [fieldData, setFieldData] = useState<{ [key: string]: string }>({});
  const Error = () => <div className="base-form-error">{error}</div>;

  // submit handler return key value pairs if valueOnSubmit is true
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (props.onSubmit) {
      if (props.valuesOnSubmit) {
        let formObject: any = {};
        Object.keys(e.target.elements).forEach((key: any) => {
          const row = e.target.elements[key];
          if (row.name.length > 0) formObject[row.name] = row.value;
        });
        props.onSubmit(formObject);
      } else {
        props.onSubmit(e);
      }
    }
  };

  const handleChange = (value: string, fieldID: string) => {
    let result = true;
    fieldData[fieldID] = value;
    console.log(fieldData)

    if (inputFields) {
      inputFields.forEach((input: InputProps) => {
        if (!fieldData[input.id] || fieldData[input.id].length === 0)
          result = false;
      });
    }
    console.log(result)
    setFieldData(fieldData);
    setComplete(result);
    console.log(loading)
    console.log(loading || !complete)
    // console.log(fieldData)
    // console.log(result)
  };

  const renderInput = (
    props: FormProps,
    inputFields: any,
    childrenPosition: string
  ) => {
    if (props.inputFields) {
      return (
        <>
          {childrenPosition === 'top' ? props.children : ''}
          <ListGroup
            items={inputFields.map((input: InputProps) => {
              return (
                <ListItem
                  key={input.id}
                  prefix={input.prefix}
                  label={
                    <Input
                      {...input}
                      disableState={true}
                      onValueChanged={(value: string) =>
                        handleChange(value, input.id)
                      }
                    />
                  }
                />
              );
            })}
          />

          {childrenPosition === 'bottom' ? props.children : ''}
        </>
      );
    } else if (props.children) {
      return props.children;
    } else
      return (
        <>
          <span>Form</span>
        </>
      );
  };

  // Reset input fields if there's been a change
  useEffect(() => {
    if (props.inputFields) {
      setInputFields(props.inputFields);
    }

    if (props.errorMessage) {
      setError(props.errorMessage);
    }
  }, [props.inputFields, props.errorMessage]);

  return (
    <div className="relative">
      {/* <Loader show={loading} hideText={true} /> */}
      <form className="base-form" onSubmit={handleSubmit}>
        {error.trim() !== '' ? <Error /> : ''}

        {renderInput(props, inputFields, childrenPosition)}

        {props.onSubmit ? (
          <div className="w-3/4 mx-auto mt-4">
            <Button
              data-testid="formSubmit"
              type="submit"
              label={props.submitLabel ? props.submitLabel : 'Submit'}
              loading={loading}
              disabledState={loading || !complete}
              buttonType="btn-primary"
              buttonClass={['base-form-button', 'w-full', 'my-4']}
            />
          </div>
        ) : (
          ''
        )}
        {!hideCancel ? (
          <Button
            data-testid="formCancel"
            label={props.cancelLabel ? props.cancelLabel : 'Cancel'}
            buttonClass={['base-form-button', 'w-full', 'my-4']}
            loading={loading}
            onClick={(e: any) =>
              props.onCancel ? props.onCancel(e) : navigate('/')
            }
          />
        ) : (
          ''
        )}
      </form>
    </div>
  );
};
