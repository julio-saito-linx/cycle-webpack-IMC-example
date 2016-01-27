import {Observable} from 'rx';
import {div, label, input, h4} from '@cycle/dom';

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
    div('.row', [
      div('.col-xs-12', [
        div('.row', [
          div('.col-xs-12', [
            div('.form-group', [
              label('.col-xs-2 .control-label', [
                props.label + ': ',
              ]),
              div('.col-xs-3', [
                input('.sliderText .form-control', {
                  type: 'number', value: value
                })
              ]),
              div('.col-xs-4', [
                h4(value + props.unit),
              ]),

            ])
          ])
        ]),
        div('.row', [
          div('.col-xs-12', [
            div('.form-group', [
              div('.col-xs-12', [
                input('.sliderRange .form-control', {
                  type: 'range', min: props.min, max: props.max, value: value
                }),
              ]),
            ])
          ])
        ])
      ])
    ])
  );

  return {
    DOM: vtree$,
    value$
  };
}

export default LabeledSlider;
