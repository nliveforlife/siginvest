<?php

/**
 * Get a list of Payouts
 */
class siginvestPayoutGetListProcessor extends modObjectGetListProcessor {
	public $objectType = 'sigPayout';
	public $classKey = 'sigPayout';
	public $defaultSortField = 'id';
	public $defaultSortDirection = 'DESC';
	//public $permission = 'list';


	/**
	 * * We doing special check of permission
	 * because of our objects is not an instances of modAccessibleObject
	 *
	 * @return boolean|string
	 */
	public function beforeQuery() {
		if (!$this->checkPermissions()) {
			return $this->modx->lexicon('access_denied');
		}

		return true;
	}


	/**
	 * @param xPDOQuery $c
	 *
	 * @return xPDOQuery
	 */
	public function prepareQueryBeforeCount(xPDOQuery $c) {
		$query = trim($this->getProperty('query'));
		if ($query) {
			$c->where(array(
				'name:LIKE' => "%{$query}%",
				'OR:description:LIKE' => "%{$query}%",
			));
		}

		return $c;
	}


	/**
	 * @param xPDOObject $object
	 *
	 * @return array
	 */
	public function prepareRow(xPDOObject $object) {
		$array = $object->toArray();
		$array['actions'] = array();

		// Edit
		$array['actions'][] = array(
			'cls' => '',
			'icon' => 'icon icon-edit',
			'title' => $this->modx->lexicon('siginvest_payout_update'),
			//'multiple' => $this->modx->lexicon('siginvest_payouts_update'),
			'action' => 'updatePayout',
			'button' => true,
			'menu' => true,
		);
/*
		if (!$array['active']) {
			$array['actions'][] = array(
				'cls' => '',
				'icon' => 'icon icon-power-off action-green',
				'title' => $this->modx->lexicon('siginvest_payout_enable'),
				'multiple' => $this->modx->lexicon('siginvest_payouts_enable'),
				'action' => 'enablePayout',
				'button' => true,
				'menu' => true,
			);
		}
		else {
			$array['actions'][] = array(
				'cls' => '',
				'icon' => 'icon icon-power-off action-gray',
				'title' => $this->modx->lexicon('siginvest_payout_disable'),
				'multiple' => $this->modx->lexicon('siginvest_payouts_disable'),
				'action' => 'disablePayout',
				'button' => true,
				'menu' => true,
			);
		}
*/
		// Remove
		$array['actions'][] = array(
			'cls' => '',
			'icon' => 'icon icon-trash-o action-red',
			'title' => $this->modx->lexicon('siginvest_payout_remove'),
			'multiple' => $this->modx->lexicon('siginvest_payouts_remove'),
			'action' => 'removePayout',
			'button' => true,
			'menu' => true,
		);

		return $array;
	}

}

return 'siginvestPayoutGetListProcessor';