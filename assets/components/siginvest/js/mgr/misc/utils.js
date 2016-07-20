siginvest.utils.renderActions = function(value, props, row) {
    //console.log(row.data);
    var res = [];
    for (var i in row.data.actions) {
        if (!row.data.actions.hasOwnProperty(i)) {continue;}
        var a = row.data.actions[i];
        if (a['button']) {
            var cls = typeof(a['class']) == 'object' && a['class']['button']
                ? a['class']['button']
                : '';
            cls += ' ' + (MODx.modx23 ? 'icon icon-' : 'fa fa-') + a['icon'];
            res.push(
                '<li>\
                    <button class="btn btn-default '+ cls +'" type="'+a['type']+'" title="'+_('siginvest_action_'+a['type'])+'"></button>\
				</li>'
            );
        }
    }

    return '<ul class="siginvest-row-actions">' + res.join('') + '</ul>';
};

siginvest.utils.getMenu = function(actions, grid) {
    var menu = [];
    for (var i in actions) {
        if (!actions.hasOwnProperty(i)) {continue;}
        var a = actions[i];
 //       console.log(a);
        if (!a['menu']) {
            if (a == '-') {
                console.log('pushed');
                menu.push('-');}
            continue;
        }
        else if (menu.length > 0 && /^remove/i.test(a['type'])) {
            menu.push('-');
        }
        console.log(a['class']);
        var cls = typeof(a['class']) == 'object' && a['class']['menu']
            ? a['class']['menu']
            : '';
        cls += ' ' + (MODx.modx23 ? 'icon icon-' : 'fa fa-') + a['icon'];

        menu.push({
         //   text: '<i class="' + cls + ' x-menu-item-icon"></i> ' + _('siginvest_action_' + a['type'])
            text: '<i class="' + cls + ' x-menu-item-icon"></i> ' + _('siginvest_project_' + a['type'])
            ,handler: grid[a['type']]
        });
    }

    return menu;
};

siginvest.utils.onAjax = function(el) {
    Ext.Ajax.el = el;
    Ext.Ajax.on('beforerequest', siginvest.utils.beforerequest);
    Ext.Ajax.on('requestcomplete', siginvest.utils.requestcomplete);
};

siginvest.utils.beforerequest = function() {Ext.Ajax.el.mask(_('loading'),'x-mask-loading');};
siginvest.utils.requestcomplete = function() {
    Ext.Ajax.el.unmask();
    Ext.Ajax.el = null;
    Ext.Ajax.un('beforerequest', siginvest.utils.beforerequest);
    Ext.Ajax.un('requestcomplete', siginvest.utils.requestcomplete);
};



/*
siginvest.utils.renderBoolean = function (value, props, row) {
	return value
		? String.format('<span class="green">{0}</span>', _('yes'))
		: String.format('<span class="red">{0}</span>', _('no'));
};

siginvest.utils.getMenu = function (actions, grid, selected) {
	var menu = [];
	var cls, icon, title, action = '';

	for (var i in actions) {
		if (!actions.hasOwnProperty(i)) {
			continue;
		}

		var a = actions[i];
		if (!a['menu']) {
			if (a == '-') {
				menu.push('-');
			}
			continue;
		}
		else if (menu.length > 0 && /^remove/i.test(a['action'])) {
			menu.push('-');
		}

		if (selected.length > 1) {
			if (!a['multiple']) {
				continue;
			}
			else if (typeof(a['multiple']) == 'string') {
				a['title'] = a['multiple'];
			}
		}

		cls = a['cls'] ? a['cls'] : '';
		icon = a['icon'] ? a['icon'] : '';
		title = a['title'] ? a['title'] : a['title'];
		action = a['action'] ? grid[a['action']] : '';

		menu.push({
			handler: action,
			text: String.format(
				'<span class="{0}"><i class="x-menu-item-icon {1}"></i>{2}</span>',
				cls, icon, title
			),
		});
	}

	return menu;
};

siginvest.utils.renderActions = function (value, props, row) {
	var res = [];
	var cls, icon, title, action, item = '';
	for (var i in row.data.actions) {
		if (!row.data.actions.hasOwnProperty(i)) {
			continue;
		}
		var a = row.data.actions[i];
		if (!a['button']) {
			continue;
		}

		cls = a['cls'] ? a['cls'] : '';
		icon = a['icon'] ? a['icon'] : '';
		action = a['action'] ? a['action'] : '';
		title = a['title'] ? a['title'] : '';

		item = String.format(
			'<li class="{0}"><button class="btn btn-default {1}" action="{2}" title="{3}"></button></li>',
			cls, icon, action, title
		);

		res.push(item);
	}

	return String.format(
		'<ul class="siginvest-row-actions">{0}</ul>',
		res.join('')
	);
};


*/