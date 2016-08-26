<?php

/**
 * Get a list of Projects
 */
class siginvestProjectGetListProcessor extends modObjectGetListProcessor {
	public $objectType = 'siginvestProject';
	public $classKey = 'siginvestProject';
	public $defaultSortField = 'id';
	public $defaultSortDirection = 'DESC';
	//public $permission = 'list';
	public $renderers = '';


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
			'class' => '',
			'icon' => 'icon icon-edit',
			'title' => $this->modx->lexicon('siginvest_project_updateProject'),
			//'multiple' => $this->modx->lexicon('siginvest_items_updateProject'),
			'action' => 'updateProject',
			'button' => true,
			'menu' => true,
			'type' => 'updateProject'
		);

		// Enable
		if (!$array['published']) {
			$array['actions'][] = array(
				'class' => '',
				'cls' => '',
				'icon' => 'icon icon-power-off action-gray',
				'title' => $this->modx->lexicon('siginvest_project_enableProject'),
				'multiple' => $this->modx->lexicon('siginvest_projects_enableProject'),
				'action' => 'enableProject',
				'button' => true,
				'menu' => true,
				'type' => 'enableProject'
			);
		}
		// or Disable
		else {
			$array['actions'][] = array(
				'class' => '',
				'cls' => '',
				'icon' => 'check action-green',
				'title' => $this->modx->lexicon('siginvest_project_disableProject'),
				'multiple' => $this->modx->lexicon('siginvest_projects_disableProject'),
				'action' => 'disableProject',
				'button' => true,
				'menu' => true,
				'type' => 'disableProject'
			);
		}

		// Remove
		$array['actions'][] = array(
			'class' => '',
			'cls' => '',
			'icon' => 'icon icon-trash-o action-red',
			'title' => $this->modx->lexicon('siginvest_project_removeProject'),
			'multiple' => $this->modx->lexicon('siginvest_projects_removeProject'),
			'action' => 'removeProject',
			'button' => true,
			'menu' => true,
			'type' => 'removeProject'
		);

		return $array;
	}

}

return 'siginvestProjectGetListProcessor';