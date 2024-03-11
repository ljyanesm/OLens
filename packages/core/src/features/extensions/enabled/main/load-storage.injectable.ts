/**
 * Copyright (c) OpenLens Maintainers. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { beforeApplicationIsLoadingInjectionToken } from "@openlens/application";
import { getInjectable } from "@ogre-tools/injectable";
import enabledExtensionsPersistentStorageInjectable from "../common/storage.injectable";

const loadEnabledExtensionsStorageInjectable = getInjectable({
  id: "load-enabled-extensions-storage",
  instantiate: (di) => ({
    run: () => {
      const storage = di.inject(enabledExtensionsPersistentStorageInjectable);

      storage.loadAndStartSyncing();
    },
  }),
  injectionToken: beforeApplicationIsLoadingInjectionToken,
});

export default loadEnabledExtensionsStorageInjectable;
