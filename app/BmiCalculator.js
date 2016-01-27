import {Observable} from 'rx';
import {div, h1, h2, h3, hr, form} from '@cycle/dom';
import isolate from '@cycle/isolate';
import LabeledSlider from './LabeledSlider';

function BmiCalculator({DOM}) {
  const WeightSlider = isolate(LabeledSlider);
  const HeightSlider = isolate(LabeledSlider);

  const weightProps$ = Observable.just({
    label: 'Peso',
    unit: 'kg',
    min: 40,
    initial: 70,
    max: 140
  });
  const heightProps$ = Observable.just({
    label: 'Altura',
    unit: 'cm',
    min: 140,
    initial: 170,
    max: 210
  });

  const weightSlider = WeightSlider({DOM, props$: weightProps$});
  const heightSlider = HeightSlider({DOM, props$: heightProps$});

  const bmi$ = Observable.combineLatest(
    weightSlider.value$,
    heightSlider.value$,
    (weight, height) => {
      const heightMeters = height * 0.01;
      const bmi = weight / (heightMeters * heightMeters);
      const bmiFormated = Math.floor(bmi * 100) / 100;

      let className = 'progress-bar-success';
      let description = '';
      if (bmi < 15) {
        className = 'progress-bar-end-of-world';
        description = 'anorexia / bulimia';
      } else if (bmi >= 15 && bmi < 18.5) {
        className = 'progress-bar-warning';
        description = 'abaixo do peso';
      } else if (bmi >= 18.5 && bmi < 25) {
        className = 'progress-bar-success';
        description = 'ok';
      } else if (bmi >= 25 && bmi < 30) {
        className = 'progress-bar-warning';
        description = 'acima do peso';
      } else if (bmi >= 30 && bmi < 35) {
        className = 'progress-bar-orange';
        description = 'obesidade';
      } else if (bmi >= 35 && bmi < 40) {
        className = 'progress-bar-danger';
        description = 'obesidade alta';
      } else if (bmi >= 40) {
        className = 'progress-bar-end-of-world';
        description = 'obesidade mórbida';
      }

      return {
        bmi,
        bmiFormated,
        className,
        description
      };
    }
  );

  const IMC_LENGTH = 28;

  return {
    DOM: bmi$.combineLatest(weightSlider.DOM, heightSlider.DOM,
      (bmiResult, weightVTree, heightVTree) =>
        div('.container', [

          h1('Índice de Massa Corporal'),
          hr(),
          form('.form-horizontal', [
            weightVTree,
            heightVTree,
          ]),
          hr(),

          h3([`${bmiResult.description}`]),
          hr(),

          h3([`IMC: ${bmiResult.bmiFormated}`]),
          hr(),

          div('.progress', [
            div({
              className: 'progress-bar ' + bmiResult.className,
              style: 'width: ' + (bmiResult.bmi - 12) / IMC_LENGTH * 100 + '%',
              'title': 'IMC: ' + bmiResult.bmiFormated
            }, [ bmiResult.bmiFormated ]),
          ]),

          div('.progress', [
            div({
              className: 'progress-bar progress-bar-danger',
              style: 'width: ' + ((15 - 12) / IMC_LENGTH) * 100 + '%',
              'title': 'anorexia (< 15)'
            }, [ 'anorexia (< 15)' ]),
            div({
              className: 'progress-bar progress-bar-warning',
              style: 'width: ' + ((18.5 - 15) / IMC_LENGTH) * 100 + '%',
              'title': 'abaixo do peso (15 - 18.5)'
            }, [ 'abaixo do peso (15 - 18.5)' ]),
            div({
              className: 'progress-bar progress-bar-success',
              style: 'width: ' + ((25 - 18.5) / IMC_LENGTH) * 100 + '%',
              'title': 'ok (18.5 - 25)'
            }, [ 'ok (18.5 - 25)' ]),
            div({
              className: 'progress-bar progress-bar-warning',
              style: 'width: ' + ((30 - 25) / IMC_LENGTH) * 100 + '%',
              'title': 'acima do peso (25 - 30)'
            }, [ 'acima do peso (25 - 30)' ]),
            div({
              className: 'progress-bar progress-bar-orange',
              style: 'width: ' + ((35 - 30) / IMC_LENGTH) * 100 + '%',
              'title': 'obesidade I (30 - 35)'
            }, [ 'obesidade I (30 - 35)' ]),
            div({
              className: 'progress-bar progress-bar-danger',
              style: 'width: ' + ((40 - 35) / IMC_LENGTH) * 100 + '%',
              'title': 'obesidade II (40 - 35)'
            }, [ 'obesidade II (40 - 35)' ]),
          ]),

        ])
      )
  };
}

export default BmiCalculator;
