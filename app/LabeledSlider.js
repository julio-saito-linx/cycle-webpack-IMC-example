import {Observable} from 'rx';
import {div, label, input} from '@cycle/dom';

function LabeledSlider({DOM, props$}) {
  const initialValue$ = props$.map(props => props.initial).last();

  const newRangeValue$ = DOM.select('.sliderRange').events('input')
    .map(ev => ev.target.value)
    ;

  const newTextValue$ = DOM.select('.sliderText').events('input')
    .map(ev => ev.target.value)
    ;

  const value$ = initialValue$
    .merge(newRangeValue$)
    .merge(newTextValue$)
    ;

  const vtree$ = Observable.combineLatest(props$, value$, (props, value) =>
    div('.form-group', [
      label('.col-sm-2 .control-label', [
        props.label + ': ',
      ]),
      div('.col-sm-2', [
        input('.sliderText .form-control', {
          type: 'text', value: value
        })
      ]),
      div('.col-sm-6', [
        input('.sliderRange .form-control', {
          type: 'range', min: props.min, max: props.max, value: value
        }),
      ]),
      label('.col-sm-2 .control-label', [
        value + props.unit,
      ]),
    ]),
  );

  return {
    DOM: vtree$,
    value$
  };
}

export default LabeledSlider;
