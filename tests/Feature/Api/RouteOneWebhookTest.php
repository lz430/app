<?php

namespace Tests\Feature\Api;

use App\Events\UserDataChanged;
use App\Models\Purchase;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class RouteOneWebhookTest extends TestCase
{
    use RefreshDatabase;
    
    protected $sampleXML = <<< XML
	<E:Envelope xmlns:E="http://schemas.xmlsoap.org/soap/envelope/">
		<SOAP:Header xmlns:SOAP="http://schemas.xmlsoap.org/soap/envelope/">
			<SOAP-SEC:Signature SOAP:mustUnderstand="1" xmlns:SOAP-SEC="http://schemas.xmlsoap.org/soap/security/2000-12">
				<Signature xmlns="http://www.w3.org/2000/09/xmldsig#">
					<SignedInfo>
						<CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
						<SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/>
						<Reference URI="#Body">
							<Transforms>
								<Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
							</Transforms>
							<DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/>
							<DigestValue>XsaV1T5AsRY7Jj2MqscGe9Z8Bcg=</DigestValue>
						</Reference>
					</SignedInfo>
					<SignatureValue>uYQlyNxc6oywgpo7zr9BvFwvkpu0vjGCMOv+h93uSuJ6GXVRMcgAUPIuaHK15nKGDVoBaW8tjmhSVj+SJ12b1e52hNLv6/rtl1rqf2EDBlFF3ZMqnpct5H6ueIW1rB45idxuQv/L8nhrBsTHWqml1/6glI8cm4Ki7HLzdYjFb4x6kxRLAd8GbuLKBLw2L9B/q+YgZfYOtjU9ZS0X1dgN90oWSYCnI8egOZH9ODqiyWQWBB5k7/sOfuZkySKuDjnvQvu3R1/rk9clMNGOSRVWG0nP1+ECVa0b2YyriV5zwckPXIwe2HMuxWCe+AXBWnly0nPJBm75F1bAo1+NJboq4A==</SignatureValue>
					<KeyInfo>
						<X509Data>
							<X509Certificate/>
							<X509IssuerSerial>
								<X509IssuerName>CN=Symantec Class 3 Secure Server CA - G4, OU=Symantec Trust Network, O=Symantec Corporation, C=US</X509IssuerName>
								<X509SerialNumber>133362472521507810775832008090856640811</X509SerialNumber>
							</X509IssuerSerial>
						</X509Data>
					</KeyInfo>
				</Signature>
			</SOAP-SEC:Signature>
		</SOAP:Header>
		<E:Body id="Body">
			<B:ProcessCreditDecision xmlns:B="http://www.starstandards.org/STAR">
				<B:ApplicationArea>
					<B:Sender>
						<B:LogicalId>www.routeone.com</B:LogicalId>
						<B:Component>CAS</B:Component>
						<B:Task>CreditDecision</B:Task>
						<B:CreatorNameCode>RouteOne, LLC</B:CreatorNameCode>
						<B:SenderNameCode>RO</B:SenderNameCode>
						<B:Language>EN</B:Language>
					</B:Sender>
					<B:CreationDateTime>2017-08-04T13:52:29.00Z</B:CreationDateTime>
					<B:Destination>
						<B:DestinationNameCode>XX</B:DestinationNameCode>
					</B:Destination>
				</B:ApplicationArea>
				<B:DataArea>
					<C:Process xmlns:C="http://www.openapplications.org/oagis"/>
					<B:CreditDecision>
						<B:Header>
							<B:DocumentDateTime>2017-08-04T13:52:29.00Z</B:DocumentDateTime>
							<B:DocumentId>F00DMR-1-01854441625</B:DocumentId>
							<B:FinanceCompany>
								<B:PartyId>F000ZG</B:PartyId>
								<B:Name>RouteOne lite TST</B:Name>
							</B:FinanceCompany>
							<B:Dealer>
								<B:PartyId>ED4XU</B:PartyId>
								<B:OrganizationId>12345</B:OrganizationId>
							</B:Dealer>
							<B:ApplicationStatus>A</B:ApplicationStatus>
							<B:ApplicationNumber>12345</B:ApplicationNumber>
						</B:Header>
						<B:Detail>
							<B:CreditVehicle>
								<B:Model>Q50</B:Model>
								<B:ModelYear>2017</B:ModelYear>
								<B:ModelDescription>91717</B:ModelDescription>
								<B:Make>INFINITI</B:Make>
								<B:SaleClass>New</B:SaleClass>
								<B:CertifiedPreownedInd>0</B:CertifiedPreownedInd>
								<B:VehicleNote>3.0t Signature Edition RWD</B:VehicleNote>
								<B:VIN>JN1EV7AP5HM742087</B:VIN>
								<B:DeliveryMileage uom="M">3</B:DeliveryMileage>
								<B:VehicleDemoInd>0</B:VehicleDemoInd>
								<B:Pricing>
									<B:VehiclePrice currency="USD">33950</B:VehiclePrice>
									<B:VehiclePricingType>MSRP</B:VehiclePricingType>
								</B:Pricing>
								<B:Pricing>
									<B:VehiclePrice currency="USD">36000</B:VehiclePrice>
									<B:VehiclePricingType>Wholesale Price</B:VehiclePricingType>
								</B:Pricing>
								<B:CollateralType>1</B:CollateralType>
								<B:AuctionInd>0</B:AuctionInd>
								<B:VehicleUse>7</B:VehicleUse>
								<B:NumberOfUnits>0</B:NumberOfUnits>
							</B:CreditVehicle>
							<B:IndividualApplicant>
								<B:PartyId>3134923214</B:PartyId>
								<B:AlternatePartyIds>
									<B:Id>XXXXXXXXXXX</B:Id>
									<B:AssigningPartyId>NationalId</B:AssigningPartyId>
								</B:AlternatePartyIds>
								<B:PersonName>
									<B:GivenName>Michael</B:GivenName>
									<B:MiddleName>C</B:MiddleName>
									<B:FamilyName>XXXXXXXXXXX</B:FamilyName>
								</B:PersonName>
								<B:Address qualifier="HomeAddress">
									<B:AddressLine>835 Margaret St</B:AddressLine>
									<B:City>Detroit</B:City>
									<B:StateOrProvince>MI</B:StateOrProvince>
									<B:Country>USA</B:Country>
									<B:PostalCode>48334</B:PostalCode>
									<B:PeriodOfResidence period="MO">108</B:PeriodOfResidence>
								</B:Address>
								<B:Contact>
									<B:Telephone desc="Evening Phone">2488627054</B:Telephone>
									<B:Telephone desc="Other">2488627054</B:Telephone>
									<B:EMailAddress desc="Home">msmith@example.com</B:EMailAddress>
									<B:OtherDescription>Cell Phone</B:OtherDescription>
								</B:Contact>
								<B:Demographics>
									<B:BirthDate>1978-10-10</B:BirthDate>
									<B:ResidenceType>2</B:ResidenceType>
									<B:RetiredInd>0</B:RetiredInd>
								</B:Demographics>
								<B:Employer>
									<B:PartyId>3134919593</B:PartyId>
									<B:Name>RouteOne</B:Name>
									<B:Contact>
										<B:Telephone desc="Day Phone">2488627000</B:Telephone>
									</B:Contact>
									<B:Income currency="USD" period="MO">2000</B:Income>
									<B:Occupation>Sales Associate</B:Occupation>
									<B:PeriodOfEmployment period="MO">60</B:PeriodOfEmployment>
									<B:EmploymentCode>Current</B:EmploymentCode>
									<B:EmploymentStatus>Full Time</B:EmploymentStatus>
								</B:Employer>
								<B:Bank/>
								<B:Co-Creditor>
									<B:PartyId>3134919234</B:PartyId>
									<B:AlternatePartyIds>
										<B:Id>XXXXXXXXXXX</B:Id>
									</B:AlternatePartyIds>
									<B:Co-CreditorFinancing>
										<B:PaymentAmount currency="USD">1200</B:PaymentAmount>
									</B:Co-CreditorFinancing>
								</B:Co-Creditor>
								<B:OtherIncome>
									<B:OtherIncomeAmount currency="USD" period="MO">350</B:OtherIncomeAmount>
									<B:IncomeSource>DISABILITY</B:IncomeSource>
								</B:OtherIncome>
							</B:IndividualApplicant>
							<B:Financing>
								<B:FinanceType>2</B:FinanceType>
								<B:PaymentAmount currency="USD">524</B:PaymentAmount>
								<B:ResidualAmount currency="USD">3500</B:ResidualAmount>
								<B:Term length="Months">72</B:Term>
								<B:DownPaymentAmount currency="USD">2500</B:DownPaymentAmount>
								<B:PurchasePrice currency="USD">34417</B:PurchasePrice>
								<B:ApplicationType>A</B:ApplicationType>
								<B:ManufacturerRebateAmount currency="USD">1200</B:ManufacturerRebateAmount>
								<B:NetTradeAmount currency="USD">800</B:NetTradeAmount>
								<B:InsuranceTotalExtendedWarrantyAmount currency="USD">0</B:InsuranceTotalExtendedWarrantyAmount>
								<B:DisabilityPremiumAmount currency="USD">0</B:DisabilityPremiumAmount>
								<B:CreditLifePremiumAmount currency="USD">0</B:CreditLifePremiumAmount>
								<B:AnnualPercentageRate>6</B:AnnualPercentageRate>
								<B:MSRPGuidePercentage>10.31</B:MSRPGuidePercentage>
								<B:Tax>
									<B:TaxType>Total</B:TaxType>
									<B:TaxAmount currency="USD">2228</B:TaxAmount>
									<B:TaxTypeId>OT</B:TaxTypeId>
								</B:Tax>
								<B:TradeIn>
									<B:Model>Other</B:Model>
									<B:ModelYear>2017</B:ModelYear>
									<B:Make>Other</B:Make>
									<B:TradeInFinancing>
										<B:BalanceAmount currency="USD">700</B:BalanceAmount>
										<B:NetTradeAllowanceAmount currency="USD">800</B:NetTradeAllowanceAmount>
										<B:GrossTradeIn currency="USD">1500</B:GrossTradeIn>
									</B:TradeInFinancing>
								</B:TradeIn>
								<B:NetAmountFinanced currency="USD">29917</B:NetAmountFinanced>
								<B:BasePaymentAmount currency="USD">524</B:BasePaymentAmount>
								<B:TotalReductionsAmount currency="USD">4500</B:TotalReductionsAmount>
							</B:Financing>
							<B:Decision>
								<B:SubmittedDateTime>2017-08-04T13:49:25.00Z</B:SubmittedDateTime>
								<B:DecisionDateTime>2017-08-04T13:52:29.00Z</B:DecisionDateTime>
								<B:Financing>
									<B:FinanceType>2</B:FinanceType>
									<B:ResidualAmount currency="USD">3500</B:ResidualAmount>
									<B:FinanceCompanyName>RouteOne lite TST</B:FinanceCompanyName>
									<B:DownPaymentAmount currency="USD">0</B:DownPaymentAmount>
									<B:ManufacturerRebateAmount currency="USD">1200</B:ManufacturerRebateAmount>
									<B:NetTradeAmount currency="USD">800</B:NetTradeAmount>
									<B:DisabilityPremiumAmount currency="USD">0</B:DisabilityPremiumAmount>
									<B:CreditLifePremiumAmount currency="USD">0</B:CreditLifePremiumAmount>
									<B:MSRPGuidePercentage>10.31</B:MSRPGuidePercentage>
									<B:Tax>
										<B:TaxType>Total</B:TaxType>
										<B:TaxAmount currency="USD">2228</B:TaxAmount>
										<B:TaxTypeId>OT</B:TaxTypeId>
									</B:Tax>
								</B:Financing>
								<B:DecisionVehicle>
									<B:Model>Q50</B:Model>
									<B:ModelYear>2017</B:ModelYear>
									<B:Make>INFINITI</B:Make>
								</B:DecisionVehicle>
							</B:Decision>
						</B:Detail>
					</B:CreditDecision>
				</B:DataArea>
			</B:ProcessCreditDecision>
			<A:RouteOne version="2.0" xmlns:A="http://www.routeone.com/namespace/2/0/namespace.messaging.CreditApplication#">
				<A:SenderID>FS000</A:SenderID>
				<A:TargetID>F00DMR</A:TargetID>
				<A:ConversationID>F00DMR-1-01854441625</A:ConversationID>
				<A:SentTimeStamp>2017-08-04T13:52:29.00Z</A:SentTimeStamp>
				<A:MessageType>R1CreditApplicationDecision</A:MessageType>
				<A:SequenceNo>2536839</A:SequenceNo>
				<A:MessageIdentifier>
					<A:R1CreditApplicationDecision>
						<A:CoBuyerVersionNumber>0</A:CoBuyerVersionNumber>
						<A:R1FSID>F000ZG</A:R1FSID>
						<A:R1DealerID>ED4XU</A:R1DealerID>
					</A:R1CreditApplicationDecision>
				</A:MessageIdentifier>
			</A:RouteOne>
		</E:Body>
	</E:Envelope>
XML;

    /** @test */
    public function it_receives_xml_and_updates_a_purchase()
    {
        Event::fake();

        $user = factory(User::class)->create(['email' => 'msmith@example.com']);
        $purchase = factory(Purchase::class)->create(['user_id' => $user->id]);
        $this->assertNull($purchase->completed_at);
        
        $response = $this->call('POST', route('route-one-webhook'), [], [], [], ['CONTENT_TYPE' => 'text/xml'], $this->sampleXML);
    
        $response->assertStatus(200);
        $purchase->refresh();
        $this->assertNotNull($purchase->completed_at);
        $this->assertEquals($purchase->application_status, 'A');

        Event::assertDispatched(UserDataChanged::class);
    }
}
