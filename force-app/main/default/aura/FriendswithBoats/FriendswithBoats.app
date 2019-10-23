<aura:application extends="force:slds">
    <div class="c-container">
        <lightning:layout multipleRows="true">
            <lightning:layoutItem padding="around-small" size="12">
                <div class="page-section page-header slds-page-header">
		          <div class="slds-media slds-no-space slds-grow">
		            <div class="slds-media__figure">
                        <lightning:icon iconName="custom:custom54" alternativeText="Boat icon" />
		            </div>
		            <div class="slds-media__body">
		              <h1 class="slds-page-header__title slds-m-right_small slds-align-middle slds-truncate" title="Friends with Boats">Friends with Boats</h1>
		            </div>
		          </div>
                </div>
            </lightning:layoutItem>
            <lightning:layoutItem padding="around-small" size="12">
                <lightning:layout>
                    <lightning:layoutItem padding="around-small" size="8">
                    	<c:BoatSearch />
                    </lightning:layoutItem>
                    <lightning:layoutItem padding="around-small" size="4">
                        <c:BoatDetails />
                    </lightning:layoutItem>
                </lightning:layout>
            </lightning:layoutItem>
            <lightning:layoutItem flexibility="auto" padding="around-small" size="12">
                <div class="page-footer page-section">
                    <h2>Footer</h2>
                </div>
            </lightning:layoutItem>
        </lightning:layout>
    </div>
</aura:application>