/**
 * Copyright (c) OpenLens Maintainers. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./crd-resources.scss";

import React from "react";
import { observer } from "mobx-react";
import { KubeObjectListLayout } from "../kube-object-list-layout";
import type { IComputedValue } from "mobx";
import { computed, makeObservable } from "mobx";
import type { ApiManager } from "../../../common/k8s-api/api-manager";
import { formatJSONValue, safeJSONPathValue } from "@openlens/utilities";
import { TabLayout } from "../layout/tab-layout-2";
import { withInjectables } from "@ogre-tools/injectable-react";
import customResourcesRouteParametersInjectable from "./custom-resources-route-parameters.injectable";
import { KubeObjectAge } from "../kube-object/age";
import type { CustomResourceDefinitionStore } from "./definition.store";
import apiManagerInjectable from "../../../common/k8s-api/api-manager/manager.injectable";
import customResourceDefinitionStoreInjectable from "./definition.store.injectable";
import { NamespaceSelectBadge } from "../namespaces/namespace-select-badge";
import type { TableCellProps } from "@openlens/list-layout";

enum columnId {
  name = "name",
  namespace = "namespace",
  age = "age",
}

interface Dependencies {
  group: IComputedValue<string>;
  name: IComputedValue<string>;
  apiManager: ApiManager;
  customResourceDefinitionStore: CustomResourceDefinitionStore;
}

@observer
class NonInjectedCustomResources extends React.Component<Dependencies> {
  constructor(props: Dependencies) {
    super(props);
    makeObservable(this);
  }

  @computed get crd() {
    return this.props.customResourceDefinitionStore.getByGroup(this.props.group.get(), this.props.name.get());
  }

  @computed get store() {
    return this.props.apiManager.getStore(this.crd?.getResourceApiBase());
  }

  render() {
    const { crd, store } = this;

    if (!crd || !store) {
      return null;
    }

    const isNamespaced = crd.isNamespaced();
    const extraColumns = crd.getPrinterColumns(false);  // Cols with priority bigger than 0 are shown in details
    const version = crd.getPreferredVersion();

    return (
      <TabLayout>
        <KubeObjectListLayout
          isConfigurable
          key={`crd_resources_${crd.getResourceApiBase()}`}
          tableId="crd_resources"
          className="CrdResources"
          store={store}
          sortingCallbacks={{
            [columnId.name]: customResource => customResource.getName(),
            [columnId.namespace]: customResource => customResource.getNs(),
            [columnId.age]: customResource => -customResource.getCreationTimestamp(),
            ...Object.fromEntries(extraColumns.map(({ name, jsonPath }) => [
              name,
              customResource => formatJSONValue(safeJSONPathValue(customResource, jsonPath)),
            ])),
          }}
          searchFilters={[
            customResource => customResource.getSearchFields(),
          ]}
          renderHeaderTitle={crd.getResourceKind()}
          customizeHeader={({ searchProps, ...headerPlaceholders }) => ({
            searchProps: {
              ...searchProps,
              placeholder: `${crd.getResourceKind()} search ...`,
            },
            ...headerPlaceholders,
          })}
          renderTableHeader={[
            { title: "Name", className: "name", sortBy: columnId.name, id: columnId.name },
            isNamespaced
              ? { title: "Namespace", className: "namespace", sortBy: columnId.namespace, id: columnId.namespace }
              : undefined,
            ...extraColumns.map(({ name }) => ({
              title: name,
              className: name.toLowerCase().replace(/\s+/g, "-"),
              sortBy: name,
              id: name,
              "data-testid": `custom-resource-column-title-${name.toLowerCase().replace(/\s+/g, "-")}`,
            })),
            { title: "Age", className: "age", sortBy: columnId.age, id: columnId.age },
          ]}
          renderTableContents={customResource => [
            customResource.getName(),
            isNamespaced && (
              <NamespaceSelectBadge namespace={customResource.getNs() as string} />
            ),
            ...extraColumns.map((column): TableCellProps => ({
              "data-testid": `custom-resource-column-cell-${column.name.toLowerCase().replace(/\s+/g, "-")}-for-${customResource.getScopedName()}`,
              title: formatJSONValue(safeJSONPathValue(customResource, column.jsonPath)),
            })),
            <KubeObjectAge key="age" object={customResource} />,
          ]}
          failedToLoadMessage={(
            <>
              <p>
                {`Failed to load ${crd.getPluralName()}`}
              </p>
              {!version.served && (
                <p>
                  {`Preferred version (${crd.getGroup()}/${version.name}) is not served`}
                </p>
              )}
            </>
          )}
        />
      </TabLayout>
    );
  }
}

export const CustomResources = withInjectables<Dependencies>(NonInjectedCustomResources, {
  getProps: (di) => ({
    ...di.inject(customResourcesRouteParametersInjectable),
    apiManager: di.inject(apiManagerInjectable),
    customResourceDefinitionStore: di.inject(customResourceDefinitionStoreInjectable),
  }),
});

