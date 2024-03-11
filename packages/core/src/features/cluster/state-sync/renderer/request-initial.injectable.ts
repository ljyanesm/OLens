/**
 * Copyright (c) OpenLens Maintainers. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import type { RequestChannelHandler } from "@openlens/messaging";
import { requestFromChannelInjectionToken } from "@openlens/messaging";
import { initialClusterStatesChannel } from "../common/channels";

export type RequestInitialClusterStates = RequestChannelHandler<typeof initialClusterStatesChannel>;

const requestInitialClusterStatesInjectable = getInjectable({
  id: "request-initial-cluster-states",
  instantiate: (di): RequestInitialClusterStates => {
    const requestFromChannel = di.inject(requestFromChannelInjectionToken);

    return () => requestFromChannel(initialClusterStatesChannel);
  },
});

export default requestInitialClusterStatesInjectable;
