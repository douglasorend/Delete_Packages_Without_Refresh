<?php
/********************************************************************************
* Subs-DPWR.php - Subs of the Delete Packages Without Refresh mod
*********************************************************************************
* This program is distributed in the hope that it is and will be useful, but
* WITHOUT ANY WARRANTIES; without even any implied warranty of MERCHANTABILITY
* or FITNESS FOR A PARTICULAR PURPOSE,
**********************************************************************************/
if (!defined('SMF'))
	die('Hacking attempt...');

function DPWR_Admin(&$admin_areas)
{
	global $context;
	$context['dpwr_function'] = $admin_areas['forum']['areas']['packages']['function'];
	$admin_areas['forum']['areas']['packages']['function'] = 'DPWR_Packages';
}

function DPWR_Packages()
{
	global $context, $txt, $forum_version, $boardurl;

	// Are we running SMF 2.0.x or SMF 2.1?
	$smf20 = (substr($forum_version, 0, 7) == 'SMF 2.0');

	// Are we are dealing with the package browse function?
	if (!isset($_REQUEST['sa']) || $_REQUEST['sa'] == 'browse')
	{
		// Add headers required for Delete Package Without Refresh mod:
		loadLanguage("Packages");
		$context['html_headers'] .= '
	<script type="text/javascript"><!-- // --><![CDATA[
		var dpwr_package_delete_bad = "' . $txt['package_delete_bad'] . '";
		var dpwr_smf20 = ' . ((int) $smf20) . ';
	// ]]></script>
	<script type="text/javascript" src="' . $boardurl . '/Themes/default/scripts/dpwr_delete.js?smf20"></script>
	<link rel="stylesheet" type="text/css" href="' . $boardurl . '/Themes/default/css/dpwr_animation.css?fin20" />';

		// We also need to make sure the loading animation gets loaded:
		// All credit for the spinner goes to: http://cssload.net/en/spinners
		$context['insert_after_template'] .= '
	<div id="floatingBarsB"><div id="floatingBarsG">
		<div class="blockG" id="rotateG_01"></div>
		<div class="blockG" id="rotateG_02"></div>
		<div class="blockG" id="rotateG_03"></div>
		<div class="blockG" id="rotateG_04"></div>
		<div class="blockG" id="rotateG_05"></div>
		<div class="blockG" id="rotateG_06"></div>
		<div class="blockG" id="rotateG_07"></div>
		<div class="blockG" id="rotateG_08"></div>
	</div></div>';

		// We need to intercept the buffer before it gets sent to the user:
		if ($smf20)
			add_integration_function('integrate_buffer', 'DPWR_Buffer_smf20', false);
		else
			add_integration_function('integrate_buffer', 'DPWR_Buffer_smf21', false);
	}
	// Or are we are dealing with the package remove function?
	elseif ($_REQUEST['sa'] == 'remove' && isset($_REQUEST['ajax']))
	{
		// Attach temporary hook to intercept the redirect for AJAX call:
		if ($smf20)
			add_integration_function('integrate_redirect', 'DPWR_Redirect_smf20', false);
		else
			add_integration_function('integrate_redirect', 'DPWR_Redirect_smf21', false);
	}

	// Make the original call that we hijacked:
	$context['dpwr_function']();
}

function DPWR_Redirect_smf20(&$setLocation, &$refresh)
{
	echo 'Done';
	exit;
}

function DPWR_Redirect_smf21(&$setLocation, &$refresh, &$permanent)
{
	echo 'Done';
	exit;
}

function DPWR_Buffer_smf20($buffer)
{
	global $txt, $context;
	$a = ' onclick="return confirm(\'' . $txt['package_delete_bad'] . '\');"';
	$b = ' onclick="return dpwr_prompt(this);"';
	$buffer = str_replace($a, $b, $buffer);
	$a = $context['session_id'] . '">[ ' . $txt['package_delete'] . ' ]';
	$b = $context['session_id'] . '"  onclick="return dpwr_delete(this);">[ ' . $txt['package_delete'] . ' ]';
	return str_replace($a, $b, $buffer);
}

function DPWR_Buffer_smf21($buffer)
{
	global $txt, $context;
	$a = ' data-confirm="' . $txt['package_delete_bad'] . '" class="button you_sure"';
	$b = ' onclick="return dpwr_prompt(this);" class="button"';
	$buffer = str_replace($a, $b, $buffer);
	$a = $context['session_id'] . '" class="button">' . $txt['package_delete'];
	$b = $context['session_id'] . '" class="button" onclick="return dpwr_delete(this);">' . $txt['package_delete'];
	return str_replace($a, $b, $buffer);
}

?>