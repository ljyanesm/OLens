/**
 * Copyright (c) OpenLens Maintainers. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getGlobalOverride } from "@openlens/test-utils";
import hardwareAccelerationShouldBeDisabledInjectable from "./hardware-acceleration-should-be-disabled.injectable";

export default getGlobalOverride(hardwareAccelerationShouldBeDisabledInjectable, () => false);
