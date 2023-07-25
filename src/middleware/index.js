import express from 'express';
import i18n from './i18n/index.js';

export default (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(i18n.init);
}