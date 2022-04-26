import {format, formatDistance, parse, set, subDays, formatDistanceToNow} from 'date-fns'
import Task from './task';
import Project from './project';
import elements from './elements';
import storage from './storage';
import dataController from './dataController';
import forms from './forms';
import uiController from './uiController';


function storageAvailable(type) {
	try {
		var storage = window[type],
			x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	}
	catch(e) {
		return false;
	}
}
