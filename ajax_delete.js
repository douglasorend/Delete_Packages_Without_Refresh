/**********************************************************************************
* ajax_delete.js - Javascript functions for Delete Package Without Refresh mod
*********************************************************************************
* This program is distributed in the hope that it is and will be useful, but
* WITHOUT ANY WARRANTIES; without even any implied warranty of MERCHANTABILITY
* or FITNESS FOR A PARTICULAR PURPOSE .
*********************************************************************************/
var dpwr_prefix = '';
var dpwr_id = '';

function ajax_delete(prompt, id, prefix, element)
{
	// See if user actually wants to delete an installed package:
	if (prompt && !confirm(smc_package_delete_bad))
		return false;

	// Try to delete the package using AJAX.  If failed, refresh the page!
	dpwr_prefix = prefix;
	dpwr_id = id;	
	var ajax =  new XMLHttpRequest();
	ajax.open('GET', element.href + ';ajax', true);
	ajax.onreadystatechange = function() 
	{
		// Remove the specified package using saved prefix/id: 
		var elem = document.getElementById(dpwr_prefix + "_" + dpwr_id);
		elem.parentNode.removeChild(elem);
		
		// Let's fix the package ID numbers (first column):
		var elements = document.getElementsByClassName('dpwr_' + dpwr_prefix);
		for(var i = 0; i < elements.length; i++) 
		{
			t = i + 1;
			elements[i].textContent = t.toString() + '.';
		}
		
		// Let's fix the alternating row backgrounds:
		var alt = false;
		var elements = document.getElementsByClassName('dpwr_' + dpwr_prefix + '_row');
		for(var i = 0; i < elements.length; i++) 
		{
			elements[i].removeClass('windowbg2');
			elements[i].removeClass('windowbg');
			elements[i].addClass( alt ? 'windowbg2' : 'windowbg' );
			alt = !alt;
		}
	}
	ajax.send();
	return false;
}

/**********************************************************************************
// https://stackoverflow.com/questions/2155737/remove-css-class-from-element-with-javascript-no-jquery
*********************************************************************************/
Node.prototype.hasClass = function (needle) 
{
    if (this.classList)
        return this.classList.contains(needle);
    else
        return (-1 < this.className.indexOf(needle));
};

Node.prototype.addClass = function (needle) 
{
    if (this.classList)
        this.classList.add(needle);
    else if (!this.hasClass(needle)) 
    {
        var haystack = this.className.split(" ");
        haystack.push(needle);
        this.className = haystack.join(" ");
    }
    return this;
};

Node.prototype.removeClass = function (needle) 
{
    if (this.classList)
        this.classList.remove(needle);
    else
    {
        var haystack = this.className.split(" ");
        haystack.splice(haystack.indexOf(needle), 1);
        this.className = haystack.join(" ");
    }
    return this;
};
