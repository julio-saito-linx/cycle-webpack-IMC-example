import {Observable} from 'rx';
import {div, h3, h4, hr, form, a} from '@cycle/dom';
import isolate from '@cycle/isolate';
import LabeledSlider from './LabeledSlider';
import RGBScale from 'rgb-scale';

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
        className = 'progress-bar-#BB491B';
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
  ).debounce(250);

  const IMC_LENGTH = 28;

  const getCurrentColor = (bmi) => {
    const colors = [
      [140, 18, 18, 1],
      [181, 162, 13, 1],
      [0, 128, 0, 1],
      [181, 162, 13, 1],
      [187, 73, 27, 1],
      [140, 18, 18, 1]
    ];
    const positions = [
      0,
      0.17,
      0.34,
      0.46,
      0.73,
      1];
    const domain = [0, 100];

    const scale = RGBScale(colors, positions, domain);

    const percentage = (bmi - 12) / IMC_LENGTH * 100;
    const colorArray = scale(percentage);

    const getColor = (index) => Math.floor(colorArray[index]);

    return `rgba(${getColor(0)}, ${getColor(1)}, ${getColor(2)}, ${getColor(3)})`;
  };

  return {
    DOM: bmi$.combineLatest(weightSlider.DOM, heightSlider.DOM,
      (bmiResult, weightVTree, heightVTree) =>
        div('.container', [

          h3({title: 'O índice de massa corporal (IMC) é uma medida' +
            ' internacional usada para calcular se uma pessoa está no peso ideal.' +
            ' Tal índice foi desenvolvido pelo polímata Lambert Quételet no fim do' +
            ' século XIX. Trata-se de um método fácil e rápido para a avaliação do' +
            ' nível de gordura de cada pessoa, ou seja, é um p#8C1212itor' +
            ' internacional de obesidade adotado pela Organização Mundial da Saúde' +
            ' (OMS). (fonte: wikipedia)'},
            ['Índice de Massa Corporal']),
          hr(),

          div('.row', [
            div('.col-md-6 col-xs-12', [
              form('.form-horizontal', [
                weightVTree,
                hr(),
                heightVTree,
              ]),
              hr(),

              h4([`IMC: ${bmiResult.bmiFormated} - ${bmiResult.description}`]),
              hr(),

              div('.progress', [
                div({
                  className: 'progress-bar',
                  style: {
                    width: (bmiResult.bmi - 12) / IMC_LENGTH * 100 + '%',
                    'background-color': getCurrentColor(bmiResult.bmi),
                  },
                  title: 'IMC: ' + bmiResult.bmiFormated,
                }, [ bmiResult.bmiFormated ]),
              ]),

              div('.progress', [
                div({
                  style: {
                    height: '100%',
                    'line-height': '20px',
                    float: 'left',
                    'text-align': 'center',
                    color: '#fff',
                    'font-size': '12px',
                    width: ((15 - 12) / IMC_LENGTH) * 100 + '%',
                    'background-color': '#8C1212',
                  },
                  title: 'anorexia (< 15)',
                }, [ '< 15' ]),
                div({
                  style: {
                    height: '100%',
                    'line-height': '20px',
                    float: 'left',
                    'text-align': 'center',
                    color: '#fff',
                    'font-size': '12px',
                    width: ((18.5 - 15) / IMC_LENGTH) * 100 + '%',
                    'background-color': '#B5A20D',
                  },
                  title: 'abaixo do peso (15 - 18.5)',
                }, [ '15 - 18.5' ]),
                div({
                  style: {
                    height: '100%',
                    'line-height': '20px',
                    float: 'left',
                    'text-align': 'center',
                    color: '#fff',
                    'font-size': '12px',
                    width: ((25 - 18.5) / IMC_LENGTH) * 100 + '%',
                    'background-color': 'green',
                  },
                  title: 'ok (18.5 - 25)',
                }, [ '18.5 - 25' ]),
                div({
                  style: {
                    height: '100%',
                    'line-height': '20px',
                    float: 'left',
                    'text-align': 'center',
                    color: '#fff',
                    'font-size': '12px',
                    width: ((30 - 25) / IMC_LENGTH) * 100 + '%',
                    'background-color': '#B5A20D',
                  },
                  title: 'acima do peso (25 - 30)',
                }, [ '25 - 30' ]),
                div({
                  style: {
                    height: '100%',
                    'line-height': '20px',
                    float: 'left',
                    'text-align': 'center',
                    color: '#fff',
                    'font-size': '12px',
                    width: ((35 - 30) / IMC_LENGTH) * 100 + '%',
                    'background-color': '#BB491B',
                  },
                  title: 'obesidade I (30 - 35)',
                }, [ '30 - 35' ]),
                div({
                  style: {
                    height: '100%',
                    'line-height': '20px',
                    float: 'left',
                    'text-align': 'center',
                    color: '#fff',
                    'font-size': '12px',
                    width: ((40 - 35) / IMC_LENGTH) * 100 + '%',
                    'background-color': '#8C1212',
                  },
                  title: 'obesidade II (40 - 35)',
                }, [ '40 - 35' ]),
              ]),

              div([
                a({
                  href: 'https://github.com/saitodisse/cycle-webpack-IMC-example',
                  target: '_blank',
                }, ['Fork me on GitHub']),
                hr(),
                'powered by: ',
                a({href: 'http://cycle.js.org/', target: '_blank'}, ['Cycle.js']),
                ', ',
                a({href: 'https://webpack.github.io/', target: '_blank'}, ['webpack']),
                ', ',
                a({href: 'https://babeljs.io/', target: '_blank'}, ['babel']),
                ', ',
                a({href: 'https://surge.sh/', target: '_blank'}, ['surge.sh']),
                ', ',
                a({href: 'https://github.com/miguelmota/rgb-scale', target: '_blank'}, ['rgb-scale']),
              ])
            ]),
          ]),

        ])
      )
  };
}

export default BmiCalculator;
