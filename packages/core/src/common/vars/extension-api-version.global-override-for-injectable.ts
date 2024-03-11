/**
 * Copyright (c) OpenLens Maintainers. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getGlobalOverride } from "@openlens/test-utils";
import extensionApiVersionInjectable from "./extension-api-version.injectable";

export default getGlobalOverride(extensionApiVersionInjectable, () => "6.0.0");
