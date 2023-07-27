import {getHumanizeLabel} from './getLastSeenLabel';

describe('getHumanizeLabel utils', () => {
    it('getHumanizeLabel() should return empty line', () => {
        const label= getHumanizeLabel();

        expect (label).toEqual('');
    });

    it('getHumanizeLabel() should return empty line fir invalid date', () => {
        const label= getHumanizeLabel(123456789123456789345678);

        expect (label).toEqual('');
    });

    it('getHumanizeLabel() should create label for last seen - now', () => {

        const jusNowPeriod = Date.now() - 40000;
        const label= getHumanizeLabel(jusNowPeriod);

        expect (label).toEqual('now');
    });

    it('getHumanizeLabel() should create label for last seen - 1 minute ago', () => {
        const oneMinutePeriod = Date.now() - 60000;
        const label= getHumanizeLabel(oneMinutePeriod);

        expect (label).toEqual('1 minute ago');
    });

    it('getHumanizeLabel() should create label for last seen - 5 minutes ago', () => {
        const oneMinutePeriod = Date.now() - 310000;
        const label= getHumanizeLabel(oneMinutePeriod);

        expect (label).toEqual('5 minutes ago');
    });

    it('getHumanizeLabel() should create label for last seen - 1 hour ago', () => {
        const oneHourPeriod = Date.now() - 3600000;
        const label= getHumanizeLabel(oneHourPeriod);

        expect (label).toEqual('1 hour ago');
    });

    it('getHumanizeLabel() should create label for last seen 1 day ago', () => {
        const oneDayPeriod = Date.now() - 86400000;
        const label= getHumanizeLabel(oneDayPeriod);

        expect (label).toEqual('1 day ago');
    });
   
    it('getHumanizeLabel() should create label for last seen 1 week ago', () => {
        const oneWeekPeriod = Date.now() - 2592000000;
        const label= getHumanizeLabel(oneWeekPeriod);

        expect (label).toEqual('1 month ago');
    });
})