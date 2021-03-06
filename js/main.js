const app = function () {
	const API_BASE = 'https://script.google.com/macros/s/AKfycbyP5Rifn7Q05Qcd7CTfm-AOouFHHvUAvCVVuKSfQu-LCqJocP8/exec';
	const API_KEY = 'abcdef';
	const CATEGORIES = ['monthly Report', 'transfer List', 'CRM Log', 'budget','financial report'];

	const state = {activePage: 1, activeCategory: null};
	const page = {};

	function init () {
		page.notice = document.getElementById('notice');
		page.filter = document.getElementById('filter');
		page.container = document.getElementById('container');

		_buildFilter();
		_getNewPosts();
	}

	function _getNewPosts () {
		page.container.innerHTML = '';
		_getPosts();
	}

	function _getPosts () {
		_setNotice('Loading submission details');

		fetch(_buildApiUrl(state.activePage, state.activeCategory))
			.then((response) => response.json())
			.then((json) => {
				if (json.status !== 'success') {
					_setNotice(json.message);
				}

				_renderPosts(json.data);
				_renderPostsPagination(json.pages);
			})
			.catch((error) => {
				_setNotice('Unexpected error loading details');
			})
	}

	function _buildFilter () {
	    page.filter.appendChild(_buildFilterLink('no filter', true));

	    CATEGORIES.forEach(function (category) {
	    	page.filter.appendChild(_buildFilterLink(category, false));
	    });
	}

	function _buildFilterLink (label, isSelected) {
		const link = document.createElement('button');
	  	link.innerHTML = _capitalize(label);
	  	link.classList = isSelected ? 'selected' : '';
	  	link.onclick = function (event) {
	  		let category = label === 'no filter' ? null : label.toLowerCase();

			_resetActivePage();
	  		_setActiveCategory(category);
	  		_getNewPosts();
	  	};

	  	return link;
	}

	function _buildApiUrl (page, category) {
		let url = API_BASE;
		url += '?key=' + API_KEY;
		url += '&page=' + page;
		url += category !== null ? '&category=' + category : '';

		return url;
	}

	function _setNotice (label) {
		page.notice.innerHTML = label;
	}

	function _renderPosts (posts) {
		posts.forEach(function (post) {
			const article = document.createElement('article');
			article.innerHTML = `
				<h2>${post.title}</h2>
				<div class="article-details">
					<div>By ${post.author} on ${_formatDate(post.timestamp)}</div>
					<div>Posted in ${post.category}</div>
				</div>
				${_formatContent(post.content)}
			`;
			page.container.appendChild(article);
		});
	}

	function _renderPostsPagination (pages) {
		if (pages.next) {
			const link = document.createElement('button');
			link.innerHTML = 'Load more submission details';
			link.onclick = function (event) {
				_incrementActivePage();
				_getPosts();
			};

			page.notice.innerHTML = '';
			page.notice.appendChild(link);
		} else {
			_setNotice('No more submissions to display');
		}
	}

	function _formatDate (string) {
		return new Date(string).toLocaleDateString('en-GB');
	}

	function _formatContent (string) {
		return string.split('\n')
			.filter((str) => str !== '')
			.map((str) => `<p>${str}</p>`)
			.join('');
	}

	function _capitalize (label) {
		return label.slice(0, 1).toUpperCase() + label.slice(1).toLowerCase();
	}

	function _resetActivePage () {
		state.activePage = 1;
	}

	function _incrementActivePage () {
		state.activePage += 1;
	}

	function _setActiveCategory (category) {
		state.activeCategory = category;
		
		const label = category === null ? 'no filter' : category;
		Array.from(page.filter.children).forEach(function (element) {
  			element.classList = label === element.innerHTML.toLowerCase() ? 'selected' : '';
  		});
	}

	return {
		init: init
 	};
}();

/* cssmenu */
(function($) {

	$.fn.menumaker = function(options) {
		
		var cssmenu = $(this), settings = $.extend({
		  title: "Menu",
		  format: "dropdown",
		  sticky: false
		}, options);
  
		return this.each(function() {
		  cssmenu.prepend('<div id="menu-button">' + settings.title + '</div>');
		  $(this).find("#menu-button").on('click', function(){
			$(this).toggleClass('menu-opened');
			var mainmenu = $(this).next('ul');
			if (mainmenu.hasClass('open')) { 
			  mainmenu.hide().removeClass('open');
			}
			else {
			  mainmenu.show().addClass('open');
			  if (settings.format === "dropdown") {
				mainmenu.find('ul').show();
			  }
			}
		  });
  
		  cssmenu.find('li ul').parent().addClass('has-sub');
  
		  multiTg = function() {
			cssmenu.find(".has-sub").prepend('<span class="submenu-button"></span>');
			cssmenu.find('.submenu-button').on('click', function() {
			  $(this).toggleClass('submenu-opened');
			  if ($(this).siblings('ul').hasClass('open')) {
				$(this).siblings('ul').removeClass('open').hide();
			  }
			  else {
				$(this).siblings('ul').addClass('open').show();
			  }
			});
		  };
  
		  if (settings.format === 'multitoggle') multiTg();
		  else cssmenu.addClass('dropdown');
  
		  if (settings.sticky === true) cssmenu.css('position', 'fixed');
  
		  resizeFix = function() {
			if ($( window ).width() > 768) {
			  cssmenu.find('ul').show();
			}
  
			if ($(window).width() <= 768) {
			  cssmenu.find('ul').hide().removeClass('open');
			}
		  };
		  resizeFix();
		  return $(window).on('resize', resizeFix);
  
		});
	};
  })(jQuery);
  
  (function($){
  $(document).ready(function(){
  
  $("#cssmenu").menumaker({
	 title: "Menu",
	 format: "multitoggle"
  });
  
  });
  })(jQuery);
