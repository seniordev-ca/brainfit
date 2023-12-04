import "./SegmentedControl.scss";
import { useEffect, useState } from "react";

export interface SegmentedControlProps {
  optionLabels: string[];
  onOptionSelected: (selectedIndex: number) => void;
  indexSelected?: number;
}

export const SegmentedControl = function ({
  optionLabels,
  onOptionSelected,
  indexSelected,
  ...props
}: SegmentedControlProps) {
  const [selected, setSelected] = useState(0)

  const widthOptions = ['', '', 'w-1/2', 'w-1/3', 'w-1/4', 'w-1/5', 'w-1/6']

  function xTranslation(segment: number): string {
    const options = ['translate-x-0', 'translate-x-full', 'translate-x-fullx2', 'translate-x-fullx3', 'translate-x-fullx4', 'translate-x-fullx5', 'translate-x-fullx6']
    return options[segment]
  }

  function optionClicked(segmentIndex: number) {
    setSelected(segmentIndex)
    onOptionSelected(segmentIndex)
  }

  useEffect(() => {
    if (indexSelected !== undefined){
      setSelected(indexSelected);
    }
  }, [indexSelected])

  return (
    <div className="segmentedControl_container">
      <div className="relative flex items-center" aria-label="Segment Control" role="group">

        <div className={`${widthOptions[optionLabels.length]} segmentedControl_selected ` + xTranslation(selected)}></div>

        {optionLabels.map((label, index) => {
          return (
            <div key={index} className="segmentedControl_label" onClick={() => optionClicked(index)} aria-label={`${index===selected ? 'Selected' : ''} ${label}, ${index+1} of ${optionLabels.length}`} tabIndex={0} role='button'> {label}</div >
          )
        })}
      </div >
    </div >
  )
};