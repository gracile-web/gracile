/* eslint-disable no-plusplus */
/* eslint-disable block-scoped-var */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck ...

import { exec as e } from 'node:child_process';
import { promisify } from 'node:util';

export function md(t): string {
	for (var s = t[0], i = 1, l = arguments.length; i < l; i++)
		s += arguments[i] + t[i];
	return s;
}

export const exec = promisify(e);
