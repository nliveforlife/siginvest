<?php

/**
 * Remove an Projects
 */
class siginvestProjectRemoveProcessor extends modObjectProcessor {
	public $objectType = 'siginvestProject';
	public $classKey = 'siginvestProject';
	public $languageTopics = array('siginvest');
	public $permission = 'remove';


	/**
	 * @return array|string
	 */
	public function process() {
		if (!$this->checkPermissions()) {
			return $this->failure($this->modx->lexicon('access_denied'));
		}

		if (!$ids = explode(',', $this->getProperty('ids'))) {
			return $this->failure($this->modx->lexicon('siginvest_projects_err_ns'));
		}
		$projects = $this->modx->getIterator($this->classKey, array('id:IN' => $ids));

		foreach ($projects as $tmp) {
			$ntmp =	$tmp->toArray();
				if ($ntmp['parts_sold'] > 0 ) {
					return $this->failure($this->modx->lexicon('siginvest_project_del_prohibited'));
			}
			$tmp->remove();
		}
		return $this->success();
	}

}

return 'siginvestProjectRemoveProcessor';