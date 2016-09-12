<?php
switch ($modx->event->name) {

	case 'msOnChangeOrderStatus':
	//	global $modx;     $modx->getService('error','error.modError'); $modx->setLogLevel(modX::LOG_LEVEL_INFO);
		// напечатать в лог ай-ди ордера:
//	    $modx->log(modX::LOG_LEVEL_INFO, 'Order_id:' . $this->object->get('id'));
	//	$modx->log(modX::LOG_LEVEL_INFO, 'siginvestSetParts.OrderStatus:' . $order->get('status') );
//      $modx->log(modX::LOG_LEVEL_INFO, 'sigSetSoldPartsToInvestor.OrderID:' . $order->get('id') );
		if (empty($status) || $status != 2) {return;}

		// $modx->log(modX::LOG_LEVEL_INFO, 'siginvestSetParts.OrderStatus:' . $payment = $order->getOne('Payment') );

	//	$modx->log(modX::LOG_LEVEL_INFO, 'PaymentClass:' . $payment->get('class') );
	//	$modx->log(modX::LOG_LEVEL_INFO, 'Oreder_toJSON:' . $order->toJSON() );
	//	$modx->log(modX::LOG_LEVEL_INFO, 'siginvestSetParts.OrderStatus:' . $order->get('status') );

// Если покупка = Пополнение счета

//		if ($order->get('') == ) {return}



		if ($status == '2' ) {
// global $modx;     $modx->getService('error','error.modError'); $modx->setLogLevel(modX::LOG_LEVEL_INFO);
			$user = $order->getOne('User');
			$user_id = $user->id;
			$order_id = $order->get('id');
			// выполняем переучет остатков:
			$q1 = $modx->newQuery('msOrderProduct');
			$data = array();
			$x = 0;
			$q1->where(array('order_id' => $order_id));
			$q1->select(array('msOrderProduct.*'));
			$q1->prepare();
			$q1->stmt->execute();
			/* Связывание по номеру столбца */
			$q1->stmt->bindColumn(2, $projectid_inOrder);
			$q1->stmt->bindColumn(5, $value_ofparts);
			// пишем выборку в массив:
			while ($q1->stmt->fetch(PDO::FETCH_BOUND)) {
				//Проверяем что ордер это не пополнение внутреннего счета
				if ($projectid_inOrder == 0) { 	return; }
				$data[$projectid_inOrder] = $value_ofparts;
			}

			foreach ($data as $pr_id => $value) {
//            print_r($pr_id); print_r('='); print_r($value);   print_r('<br>');
				// получаем данные о проекте
				$q2 = $modx->newQuery('siginvestProject');
				$q2->where(array('project_id' => $pr_id));
				$q2->select(array('siginvestProject.*'));
				$q2->prepare();
				$q2->stmt->execute();
				$out = $q2->stmt->fetch(PDO::FETCH_BOTH);
				$pr_need_to_gather = $out['need_to_gather'];
				$pr_parts_sold = $out['parts_sold'];
				$pr_parts_left = $out['parts_left'];
				if (($pr_parts_sold + $pr_parts_left) != $pr_need_to_gather ) {
//$modx->log(modX::LOG_LEVEL_INFO, 'Error in project Data, project_id:' . $pr_id );
				}
				// Новые значение для записи в базу
				$q3 = $modx->newQuery('siginvestProject');
				$q3->command('update');
				$q3->where(array('project_id' => $pr_id));
				$q3->set(array('parts_sold' => $pr_parts_sold += $value));
				$q3->set(array('parts_left' => $pr_parts_left -= $value));
				$q3->prepare();
				$q3->stmt->execute();
				//  }
				// конец записи в таблицу проектов
				// пишем в таблицу sig_Parts
				while ($value > $x) {
					$x += 1;
					$pr_part_id = "prj" . "$pr_id" . "ord" . strval($order_id) . "part". '00' . "$x";
					//  print_r('Part_id: ');  print_r($pr_part_id);   print_r('<br>');
					$Sold = $modx->newObject("sigPart", array(
						'user_id' => $user_id
					,'order_id' => $order_id
					, 'part_id' => $pr_part_id
					,'project_id' => $pr_id
					,'order_status' => '2',));
					$Sold->save();
				};
				$x = 0;
			}
			// конец записи в таблицу sig_Parts

			//Начало записи в таблицу sig_Investors
			foreach ($data as $pr_id => $value) {
				$q31 = $modx->newQuery('sigInvestor');
				$q31->where(array('project_id' => $pr_id));
				$q31->where(array('user_id' => $user_id), xPDOQuery::SQL_AND);
				$q31->select(array('sigInvestor.*'));
				$q31->prepare();
				$q31->stmt->execute();
				$result = $q31->stmt->fetchAll(PDO::FETCH_ASSOC);
				// если такая запись не найдена - то создаем новую
				if(empty($result)) {
					$newinvestor = $modx->newObject("sigInvestor", array(
						'user_id' => $user_id
					,'project_id' => $pr_id
					, 'number_of_parts' => $value,));
					$newinvestor->save();
				} else {
					//если запись найдена - то прибавляем количество новокупленных частей к старым
					$newvalue = $result[0]['number_of_parts'] + $value;
					$q33 = $modx->newQuery('sigInvestor');
					$q33->command('update');
					$q33->where(array('project_id' => $pr_id));
					$q33->where(array('user_id' => $user_id), xPDOQuery::SQL_AND);
					$q33->set(array('number_of_parts' => $newvalue));
					$q33->prepare();
					$q33->stmt->execute();

//					print_r('Количество старых частей:'); print_r($result[0]); print_r('<br>');
//					print_r('NewValue:' . $newvalue); print_r('<br>');
				}
			}
			// конец записи в sig_Investors


			//Начало подсчета количества инвесторов
			foreach ($data as $pr_id => $value) {
				$q4 = $modx->newQuery('sigInvestor');
				$q4->where(array('project_id' => $pr_id));
				$q4->select(array('sigInvestor.user_id'));
				$q4->prepare();
				$q4->stmt->execute();
				$result = $q4->stmt->fetchAll(PDO::FETCH_ASSOC);
				$invcount = count($result);
				// записываем количество инвесторов в талицу sig_projects
				$q41 = $modx->newQuery('siginvestProject');
				$q41->command('update');
				$q41->where(array('project_id' => $pr_id));
				$q41->set(array('project_invrs_count' => $invcount));
				$q41->prepare();
				$q41->stmt->execute();

			/*
				print_r('==========================');print_r('<br>');
				print_r('Ай-ди преокта:' . $pr_id); print_r('<br>');
				print_r('Result:'); print_r($result); print_r('<br>');
				print_r('Количество инвесторов преокта:'); print_r(count($result)); print_r('<br>');
			*/
			}
			//конец подсчета количества инвесторов.

		}

		/** @var modUser $user */
/*
		if ($user = $order->getOne('User')) {
			$q = $modx->newQuery('msOrder', array('type' => 0));
			$q->innerJoin('modUser', 'modUser', array('`modUser`.`id` = `msOrder`.`user_id`'));
			$q->innerJoin('msOrderLog', 'msOrderLog', array(
				'`msOrderLog`.`order_id` = `msOrder`.`id`',
				'msOrderLog.action' => 'status',
				'msOrderLog.entry' => $status,
			));
			$q->where(array('msOrder.user_id' => $user->id));
			$q->groupby('msOrder.user_id');
			$q->select('SUM(`msOrder`.`cost`)');
			if ($q->prepare() && $q->stmt->execute()) {
				$spent = $q->stmt->fetch(PDO::FETCH_COLUMN);
	//			/** @var msCustomerProfile $profile */
/*
							if ($profile = $modx->getObject('msCustomerProfile', $user->id)) {
					$profile->set('spent', $spent);
					$profile->save();
				}
			}
		}
		*/
		break;
}