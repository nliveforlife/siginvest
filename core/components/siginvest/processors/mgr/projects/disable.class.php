<?php

/**
 * Disable an Project
 */
class siginvestProjectDisableProcessor extends modProcessor {
	public $objectType = 'siginvestProject';
	public $classKey = 'siginvestProject';
	public $languageTopics = array('siginvest');
	public $permission = 'save';

	/** {inheritDoc} */
	public function process() {
		if (!$ids = explode(',', $this->getProperty('ids'))) {
			return $this->failure($this->modx->lexicon('siginvest_item_err_ns'));
		}
		$siginvestProjects = $this->modx->getIterator($this->classKey, array('id:IN' => $ids, 'published' => true));
		/** @var siginvestProject $siginvestProject */
		foreach ($siginvestProjects as $siginvestProject) {
			$siginvestProject->set('published', false);
			$siginvestProject->save();
		}
		return $this->success();
	}

}

return 'siginvestProjectDisableProcessor';
