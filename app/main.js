import {run} from '@cycle/core';
import {makeDOMDriver} from '@cycle/dom';
import BmiCalculator from './BmiCalculator';
import './style.css';

const main = BmiCalculator;

run(main, {
  DOM: makeDOMDriver('#main-container')
});
