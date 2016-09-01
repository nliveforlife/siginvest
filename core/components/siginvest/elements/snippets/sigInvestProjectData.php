<?php
/**
 *
 */
//ini_set('display_errors',1);
//error_reporting(E_ALL);
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

//
//$fqn = $modx->getOption('pdoFetch.class', null, 'pdotools.pdofetch', true);
//$pdoClass = $modx->loadClass($fqn, MODX_CORE_PATH . 'components/pdotools/model/', false, true);

/*
$q1 = $modx->newQuery('msProductOption');
$id = $modx->resource->get('id');
$q1->where(array('product_id' => $id));
$q1->select(array('msProductOption.*'));
$q1->prepare();
$q1->stmt->execute();
$data = array();
    $q1->stmt->bindColumn(1, $product_id_id);
    $q1->stmt->bindColumn(2, $key);
    $q1->stmt->bindColumn(3, $value);
while ($row = $q1->stmt->fetch(PDO::FETCH_BOUND)) {$data[$key] = $value;}
*/
$id = $modx->resource->get('id');
$data = array();
$q1 = $modx->newQuery('siginvestProject', $id);
$q1->where(array('project_id' => $id));
$q1->select(array('siginvestProject.*'));
$q1->prepare();
$q1->stmt->execute();
$data = $q1->stmt->fetch(PDO::FETCH_BOTH);

$data['already_got'] = $already_got = $data['current_part_price'] * $data['parts_sold'];
$data['still_need'] = $still_need = $data['parts_left'] * $data['current_part_price'];
$data['got_inpersent'] = round(($already_got / $data['need_to_gather'] )*100, 2) ;

    // Передаем данные в чанк:
$output = '';
//$product = $modx->resource;
//$productData = $product->toArray();
$productData = $data;
// 'ключ для плейсхолдера' => (значение опции)
$pData = array(
	'статус_проекта' => $productData['project_status'],
	'собрано_в_процентах' => $productData['got_inpersent'],
	'Выпущено_долей' => $productData['parts_made'],
	'Необходимо_собрать'  => $productData['need_to_gather'],
	'Уже_собрано' => $productData['already_got'],
	'Осталось_собрать' => $productData['still_need'],
	'Продано_долей' => $productData['parts_sold'],
	'Осталось_долей' => $productData['parts_left'],
	'Цена_доли' => $productData['part_price'],
	'Количество_инвесторов' => $productData['project_invrs_count']
);
$output = $pdoFetch->getChunk($tpl, $pData);

return $output;