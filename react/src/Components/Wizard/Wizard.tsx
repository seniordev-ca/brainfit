// CSS
import './Wizard.css';
import { renderStep } from '../../pages/Step/Steps';
import { nextStep } from '../../slices/navigationSlice';

// ATOMS
import { Button } from '../Button/Button';
import { ProgressBar } from '../Progress/ProgressBar';
import store from 'store/store';
import { ReactElement } from 'react';

export const Wizard = (props: any): ReactElement => {

  //let navigate = useNavigate(); 


  return (
    <main className="container mx-auto">
      <div className="flex justify-center px-2 my-2">
        {/* Row */}
        <div className="shadow-xl w-full lg:w-11/12 xl:w-2/3 rounded-xl">
          <div className="flex flex-col md:flex-row">
            {/* Col */}
            <div className="w-full h-auto bg-blue-400 p-4 md:w-1/3 lg:w-4/12 rounded-t-xl md:rounded-tr-none md:rounded-bl-xl">
              <ProgressBar />
            </div>
            {/* Col */}
            <div className="w-full md:w-2/3 lg:w-8/12 bg-white p-5 rounded-b-xl md:rounded-bl-none md:rounded-tr-xl">
              <form className="sm:px-16 pt-6 rounded  flex flex-col justify-between h-full">
                {renderStep('home')}
                <div id="formSubmits">
                  <div className="mt-8 mb-6 text-center grid grid-cols-2 gap-4">
                    <Button
                      //onClick={() => {navigate('/signup')}}
                      label="Back"
                    />
                    <Button
                      buttonType="btn-primary"
                      buttonClass={['']}
                      onClick={async () => { console.log('next'); await store.dispatch(nextStep) }}
                      label='Continue'
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
