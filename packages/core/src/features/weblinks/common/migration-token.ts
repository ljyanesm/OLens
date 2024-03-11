/**
 * Copyright (c) OpenLens Maintainers. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectionToken } from "@ogre-tools/injectable";
import type { MigrationDeclaration } from "../../../common/persistent-storage/migrations.injectable";

export const weblinkStoreMigrationInjectionToken = getInjectionToken<MigrationDeclaration>({
  id: "weblink-store-migration-token",
});
