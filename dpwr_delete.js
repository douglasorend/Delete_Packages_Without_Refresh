/**********************************************************************************
* dpwr_delete.js - Javascript functions for Delete Package Without Refresh mod
*********************************************************************************
* This program is distributed in the hope that it is and will be useful, but
* WITHOUT ANY WARRANTIES; without even any implied warranty of MERCHANTABILITY
* or FITNESS FOR A PARTICULAR PURPOSE .
*********************************************************************************/
var dpwr_element;

function dpwr_prompt(element)
{
	var message = dpwr_package_delete_bad;
	if (!dpwr_smf20)
		message = message.replace(/-n-/g, "\n")
	if (confirm(message))
		dpwr_delete(element);
	return false;
}

function dpwr_delete(element)
{
	// Make the loading animation visible:
	dpwr_element = element;
	document.getElementById('floatingBarsB').style.display = 'block';

	// Set up a call to delete the package via AJAX:
	var ajax =  new XMLHttpRequest();
	ajax.open('GET', element.href + ';ajax', true);
	ajax.onreadystatechange = function()
	{
		if (ajax.readyState == 4 && ajax.status == 200)
		{
			// Remove the specified package using saved prefix/id:
			var row = dpwr_element.parentElement.parentElement;
			var id = parseInt(row.getElementsByTagName('td')[0].innerHTML);
			var table = row.parentElement;
			table.removeChild(row);

			// Do we have any more packages in that section?  If not, reload window:
			var elements = table.getElementsByTagName('tr');
			if (elements.length == 0)
				window.location.reload();

			// Let's fix the package ID numbers of the elements we pulled:
			for(var i = 0; i < elements.length; i++)
			{
				var row = elements[i].getElementsByTagName('td')[0];
				var num = parseInt(row.innerHTML) - 1;
				if (num >= id)
					row.textContent = num.toString() + (dpwr_smf20 ? '.' : '');
			}

			// Let's fix the alternating row backgrounds:
			var alt = false;
			for(var i = 0; i < elements.length; i++)
			{
				var row = elements[i];
				row.removeClass('windowbg2').removeClass('windowbg');
				row.addClass( alt ? 'windowbg2' : 'windowbg' );
				alt = !alt;
			}

			// Remove the loading animation from the screen now:
			document.getElementById('floatingBarsB').style.display = 'none';
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
