<?php
$xpdo_meta_map['sigInvestor']= array (
  'package' => 'siginvest',
  'version' => '1.1',
  'table' => 'sig_Investors',
  'extends' => 'xPDOSimpleObject',
  'fields' => 
  array (
    'part_id' => '',
    'user_id' => 0,
    'order_id' => 0,
    'project_id' => 0,
    'order_time' => 'CURRENT_TIMESTAMP',
    'order_status' => '',
  ),
  'fieldMeta' => 
  array (
    'part_id' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '55',
      'phptype' => 'string',
      'null' => true,
      'default' => '',
    ),
    'user_id' => 
    array (
      'dbtype' => 'int',
      'precision' => '10',
      'phptype' => 'integer',
      'attributes' => 'unsigned',
      'null' => true,
      'default' => 0,
    ),
    'order_id' => 
    array (
      'dbtype' => 'int',
      'precision' => '10',
      'phptype' => 'integer',
      'attributes' => 'unsigned',
      'null' => true,
      'default' => 0,
    ),
    'project_id' => 
    array (
      'dbtype' => 'int',
      'precision' => '10',
      'phptype' => 'integer',
      'attributes' => 'unsigned',
      'null' => true,
      'default' => 0,
    ),
    'order_time' => 
    array (
      'dbtype' => 'timestamp',
      'phptype' => 'timestamp',
      'null' => false,
      'default' => 'CURRENT_TIMESTAMP',
    ),
    'order_status' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '255',
      'phptype' => 'string',
      'null' => true,
      'default' => '',
    ),
  ),
  'indexes' => 
  array (
    'user_id' => 
    array (
      'alias' => 'user_id',
      'primary' => false,
      'unique' => false,
      'type' => 'BTREE',
      'columns' => 
      array (
        'user_id' => 
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
      ),
    ),
  ),
);
