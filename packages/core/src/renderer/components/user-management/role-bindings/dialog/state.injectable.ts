/**
 * Copyright (c) OpenLens Maintainers. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { observable } from "mobx";
import type { RoleBinding } from "@openlens/kube-object";

export type RoleBindingDialogState = {
  isOpen: false;
  roleBinding?: undefined;
} | {
  isOpen: true;
  roleBinding: RoleBinding | undefined;
};

const roleBindingDialogStateInjectable = getInjectable({
  id: "role-binding-dialog-state",
  instantiate: () => observable.box<RoleBindingDialogState>({ isOpen: false }),
});

export default roleBindingDialogStateInjectable;
