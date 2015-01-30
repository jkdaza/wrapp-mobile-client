/**
 * Implements hook_field_widget_form().
 * @param {Object} form
 * @param {Object} form_state
 * @param {Object} field
 * @param {Object} instance
 * @param {String} langcode
 * @param {Object} items
 * @param {Number} delta
 * @param {Object} element
 */
function wrapp_client_field_widget_form(form, form_state, field, instance, langcode, items, delta, element) {
  try {
    console.log(element);
  }
  catch (error) { console.log('hook_field_widget_form - ' + error); }
}


/**
* Implements hook_menu().
*/
function wrapp_client_menu() {
  var items = {};
  items['node/add'] = {
    title: 'Add an Entry',
    page_callback: 'wrapp_client_entry_add_page',
    options:{
        reloadPage:true
     }
  };
  items['entries'] = {
    title: 'My Entries',
    page_callback: 'wrapp_client_entries_page'
  };
  
  return items;
}

/*function wrapp_client_deviceready() {
	$.ajax({
		  dataType: "json",
		  async: false,
		  url: Drupal.settings.base_path+'api/allowed-entries',
		  data: {},
		  success: function(d) {
				Drupal.settings.allowedFrameworks = d;
				return true;
		  },
		  error: function() {
			  Drupal.settings.allowedFrameworks = null;
			  return true;
		  }
		});
}*/
/**
 * Implements hook_drupalgap_goto_preprocess().
 */
/*function wrapp_client_drupalgap_goto_preprocess(path) {
	if (path == drupalgap.settings.front) {
		if (parseInt(Drupal.user.uid,10) == 0) {
			Drupal.settings.allowedFrameworks = null;
    		drupalgap_goto('user/login');
    	} else {
    		if (Drupal.settings.allowedFrameworks == null) {
    			$.ajax({
    				  dataType: "json",
    				  async: false,
    				  url: Drupal.settings.base_path+'api/allowed-entries',
    				  data: {},
    				  success: function(d) {
    						Drupal.settings.allowedFrameworks = d;
    						drupalgap_goto('add-entry', {reloadPage:true});
    						return true;
    				  },
    				  error: function() {
    					  Drupal.settings.allowedFrameworks = null;
    					  return true;
    				  }
    				});
    		}
    	}
		
	}
}*/


/**
 * Page call back for add-entry.
 * @return {Object}
 */
function wrapp_client_entry_add_page() {
  try {
    var content = {
      'header': {'markup': '<h2>Add an Entry</h2>'},
      'node_type_listing': {
        'theme': 'jqm_item_list',
        'attributes': {'id': 'node_type_listing_items'}
      }
    };
    var items = [];
   
    $.each(
      Drupal.user.content_types_user_permissions,
      function(type, permissions) {
        if (permissions.create) {
          items.push(l(drupalgap.content_types_list[type].name,
          'node/add/' + type));
        }
      }
    );
    content.node_type_listing.items = items;
    /*
     var d = Drupal.settings.allowedFrameworks;
    if (d) {
	    for (var idx in d) {
			var type = d[idx];
			if (type in drupalgap.content_types_list) {
				items.push(l(drupalgap.content_types_list[type].name,
	                  'node/add/' + type));
			}
		}
	    content.node_type_listing.items = items;
    } else {
    	content['header'] = '';
    	content['no_framework'] = {
				markup: '<p>Sorry, you cannot add entries at the moment.</p>'
		}
    }*/
    if (parseInt(Drupal.user.uid,10) == 0) {
    	content['no_framework'] = {
				markup: '<p>You must login in order to add entries.</p>'
		}
		content['user_login'] = {
			    path: 'user/login',
			    text: 'Go to Login',
			    theme: 'button_link'
		};
    	
    }
    
    return content;
    
  }
  catch (error) { console.log('node_add_page - ' + error); }
}

/**
 * Page call back for entries.
 * @return {Object}
 */
function wrapp_client_entries_page() {
	try {
		var content = {};
		content['my_entries_list'] = {
				theme: 'view',
				format: 'ul',
				path: 'api/entries/my-entries', /* the path to the view in Drupal */
				row_callback: 'wrapp_client_entries_list_row',
				empty_callback: 'wrapp_client_entries_list_empty',
				attributes: {
					id: 'my_articles_list_view'
				}
	    	};
		return content;
	}
	catch (error) { console.log('my_module_articles_page - ' + error); }
	
}


/**
 * The row callback to render a single row.
 */
function wrapp_client_entries_list_row(view, row) {
  try {
    return l(row.title, 'node/' + row.nid);
  }
  catch (error) { console.log('my_module_articles_list_row - ' + error); }
}

/**
 *
 */
function wrapp_client_entries_list_empty(view) {
  try {
    return 'Sorry, no entries were found.';
  }
  catch (error) { console.log('my_module_articles_list_empty - ' + error); }
}