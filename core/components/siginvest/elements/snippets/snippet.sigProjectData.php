<?php
/**
 *
 */
//ini_set('display_errors',1);
//error_reporting(E_ALL);

/** @var array $scriptProperties */
/** @var siginvest $siginvest */
$scriptProperties = array();
global $modx;
if (!$siginvest = $modx->getService('siginvest', 'siginvest', $modx->getOption('siginvest_core_path', null, $modx->getOption('core_path') . 'components/siginvest/') . 'model/siginvest/', $scriptProperties)) {
	return 'Could not load siginvest class!';
}

// Do your snippet code here. This demo grabs 5 items from our custom table.
//$tpl = $modx->getOption('tpl', $scriptProperties, 'Project');
//$sortby = $modx->getOption('sortby', $scriptProperties, 'name');
//$sortdir = $modx->getOption('sortbir', $scriptProperties, 'ASC');
//$limit = $modx->getOption('limit', $scriptProperties, 5);
//$outputSeparator = $modx->getOption('outputSeparator', $scriptProperties, "\n");
//$toPlaceholder = $modx->getOption('toPlaceholder', $scriptProperties, false);

$fqn = $modx->getOption('pdoFetch.class', null, 'pdotools.pdofetch', true);
if ($pdoClass = $modx->loadClass($fqn, '', false, true)) {
	$pdoFetch = new $pdoClass($modx, $scriptProperties);
}
elseif ($pdoClass = $modx->loadClass($fqn, MODX_CORE_PATH . 'components/pdotools/model/', false, true)) {
	$pdoFetch = new $pdoClass($modx, $scriptProperties);
}
else {
	$modx->log(modX::LOG_LEVEL_ERROR, 'Could not load pdoFetch from "MODX_CORE_PATH/components/pdotools/model/".');
	return false;
}

$id = $modx->resource->get('id');
$data = array();
$q1 = $modx->newQuery('siginvestProject');
$q1->where(array('project_id' => $id));
$q1->select(array('siginvestProject.*'));
$q1->prepare();
$q1->stmt->execute();
$data = $q1->stmt->fetch(PDO::FETCH_BOTH);

$data['already_got'] = $already_got = $data['current_part_price'] * $data['parts_sold'];
$data['still_need'] = $still_need = $data['parts_left'] * $data['current_part_price'];
$data['got_inpersent'] = round(($already_got / $data['need_to_gather'] )*100, 2) ;

//	$modx->log(modX::LOG_LEVEL_ERROR, 'ID' . $id);
//	$modx->log(modX::LOG_LEVEL_ERROR, 'Data' . json_encode($data));

//// Передаем данные в чанк:
$output = '';

$productData = $data;
// 'ключ для плейсхолдера' => (значение опции)
$pData = array(
	'статус_проекта' => $productData['status'],
	'собрано_в_процентах' => $productData['got_inpersent'],
	'Выпущено_долей' => $productData['parts_made'],
	'Необходимо_собрать'  => $productData['need_to_gather'],
	'Уже_собрано' => $productData['already_got'],
	'Осталось_собрать' => $productData['still_need'],
	'Продано_долей' => $productData['parts_sold'],
	'Осталось_долей' => $productData['parts_left'],
	'Цена_доли' => $productData['current_part_price'],
	'Количество_инвесторов' => $productData['project_invrs_count'],
	'Пл_прибыль' => $productData['dev_profit_plan'],
	'Пр_инвестору' => $productData['dev_persent_to_inv'],
	'Период_распр' => $productData['dev_term'],
	'Обратный_выкуп' => $productData['dev_buyback'],
	'Кол_выплат' => $productData['dev_paid_count'],
	'Всего_выплачено' => $productData['dev_paid_vsego']
);
$output = $pdoFetch->getChunk($tpl, $pData);

return $output;