#!/bin/bash
cd dialog-client;yarn build; 
cd ..
cd sidebar-client;yarn build
cd ..
clasp push