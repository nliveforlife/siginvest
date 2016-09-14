<?php
/**
 * Snippet to show investors parts
 *
 */
$scriptProperties = array();
$fqn = $modx->getOption('pdoFetch.class', null, 'pdotools.pdofetch', true);
if ($pdoClass = $modx->loadClass($fqn, '', false, true)) {
//	$pdoFetch = new $pdoClass($modx, $scriptProperties);
	$pdoFetch = new pdoFetch($modx, $scriptProperties);
}
elseif ($pdoClass = $modx->loadClass($fqn, MODX_CORE_PATH . 'components/pdotools/model/', false, true)) {
//	$pdoFetch = new $pdoClass($modx, $scriptProperties);
	$pdoFetch = new pdoFetch($modx, $scriptProperties);
}
else {
	$modx->log(modX::LOG_LEVEL_ERROR, 'Could not load pdoFetch from "MODX_CORE_PATH/components/pdotools/model/".');
	return false;
}

$scriptProperties['class'] = 'sigInvestor';

$where['user_id'] = $userid = $modx->user->get('id');

$default = array(
//    'class' => $class,
	'where' => $modx->toJSON($where),
//    'leftJoin' => $modx->toJSON($leftJoin),
//    'innerJoin' => $modx->toJSON($innerJoin),
//    'select' => $modx->toJSON($select),
//    'sortby' => $class.'id',
//    'sortdir' => 'ASC',
//    'groupby' => $class.'.id',
//    'fastMode' => false,
	'return' => !empty($returnIds) ? 'ids' : 'data',
//    'nestedChunkPrefix' => 'minishop2_',
);


$pdoFetch->setConfig(array_merge($default, $scriptProperties));
$rows = $pdoFetch->run();

  foreach ($rows as $k => $row) {
	  $projectpage = $modx->getObject('modResource', $row['project_id']);
	  $pagetitle = $projectpage->get('pagetitle');
	  $row['pagetitle'] = $pagetitle;
	  $output[] .= $pdoFetch->getChunk($tplRow, $row);
  }


// Return output
if (!empty($toSeparatePlaceholders)) {
	$modx->setPlaceholders($output, $toSeparatePlaceholders);
	$modx->setPlaceholder($log, $toSeparatePlaceholders.'log');
}
else {
	if (empty($outputSeparator)) {$outputSeparator = "\n";}
	$output = is_array($output) ? implode($outputSeparator, $output) : $output;
	$output .= $log;

	if (!empty($tplWrapper) && (!empty($wrapIfEmpty) || !empty($output))) {
		$output = $pdoFetch->getChunk($tplWrapper, array('output' => $output), $pdoFetch->config['fastMode']);
	}

	if (!empty($toPlaceholder)) {
		$modx->setPlaceholder($toPlaceholder, $output);
	}
	else {
		return $output;
	}
}