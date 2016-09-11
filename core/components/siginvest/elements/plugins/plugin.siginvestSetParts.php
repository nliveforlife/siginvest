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
				if ($projectid_inOrder == 0) {
//				$modx->log(modX::LOG_LEVEL_INFO, 'Project_ID_in_Order:' . $projectid_inOrder );
					return;
				}
				$data[$projectid_inOrder] = $value_ofparts;  }

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
				// пишем в таблицу sig_Investors
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
			// конец записи в таблицу sig_Investors
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