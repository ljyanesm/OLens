/**
 * Copyright (c) OpenLens Maintainers. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { requestFromChannelInjectionToken } from "@openlens/messaging";
import { deactivateClusterChannel } from "../common/channels";
import { requestClusterDeactivationInjectionToken } from "../common/request-token";

const requestClusterDeactivationInjectable = getInjectable({
  id: "request-cluster-deactivation",
  instantiate: (di) => {
    const requestFromChannel = di.inject(requestFromChannelInjectionToken);

    return (clusterId) => requestFromChannel(deactivateClusterChannel, clusterId);
  },
  injectionToken: requestClusterDeactivationInjectionToken,
});

export default requestClusterDeactivationInjectable;
