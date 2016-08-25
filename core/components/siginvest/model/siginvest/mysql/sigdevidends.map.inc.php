<?php
$xpdo_meta_map['sigDevidends']= array (
  'package' => 'siginvest',
  'version' => '1.1',
  'table' => 'sig_Devidends',
  'extends' => 'xPDOSimpleObject',
  'fields' => 
  array (
    'project_id' => 0,
    'name' => '',
    'dev_paid' => 0,
    'dev_paid_per_part' => 0,
    'dev_paid_number' => 0,
    'dev_paid_date' => 'CURRENT_TIMESTAMP',
    'partner_owner_id' => 0,
  ),
  'fieldMeta' => 
  array (
    'project_id' => 
    array (
      'dbtype' => 'integer',
      'precision' => '10',
      'attributes' => 'unsigned',
      'phptype' => 'integer',
      'null' => true,
      'default' => 0,
    ),
    'name' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '100',
      'phptype' => 'string',
      'null' => false,
      'default' => '',
    ),
    'dev_paid' => 
    array (
      'dbtype' => 'integer',
      'precision' => '10',
      'attributes' => 'unsigned',
      'phptype' => 'integer',
      'null' => true,
      'default' => 0,
    ),
    'dev_paid_per_part' => 
    array (
      'dbtype' => 'integer',
      'precision' => '10',
      'attributes' => 'unsigned',
      'phptype' => 'integer',
      'null' => true,
      'default' => 0,
    ),
    'dev_paid_number' => 
    array (
      'dbtype' => 'integer',
      'precision' => '10',
      'attributes' => 'unsigned',
      'phptype' => 'integer',
      'null' => true,
      'default' => 0,
    ),
    'dev_paid_date' => 
    array (
      'dbtype' => 'timestamp',
      'phptype' => 'timestamp',
      'null' => false,
      'default' => 'CURRENT_TIMESTAMP',
    ),
    'partner_owner_id' => 
    array (
      'dbtype' => 'int',
      'precision' => '10',
      'phptype' => 'integer',
      'attributes' => 'unsigned',
      'null' => true,
      'default' => 0,
    ),
  ),
  'indexes' => 
  array (
    'project_id' => 
    array (
      'alias' => 'project_id',
      'primary' => false,
      'unique' => false,
      'type' => 'BTREE',
      'columns' => 
      array (
        'project_id' => 
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
      ),
    ),
  ),
);
