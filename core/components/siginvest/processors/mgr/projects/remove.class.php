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
		$unique = array('parts_sold');
		foreach ($unique as $tmp) {
			$sold_parts_count = $this->modx->getObject($this->classKey, array($tmp => $this->getProperty($tmp), 'id:!=' => $this->getProperty('id')));
				if ($sold_parts_count !== 0) {
					return $this->failure($this->modx->lexicon('siginvest_project_del_prohibited'));
			}
		}

		/** @var siginvestProject $project */
		foreach ($projects as $project) {
			$project->remove();
		}
		return $this->success();

	}

}

return 'siginvestProjectRemoveProcessor';