<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Header>
        <wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
            <wsse:UsernameToken wsu:Id="UsernameToken-44A5F02EB137A75A8E152428302008513">
                <wsse:Username>{{$username}}</wsse:Username>
                <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">{{$password}}</wsse:Password>
            </wsse:UsernameToken>
        </wsse:Security>
    </soap:Header>
    <soap:Body>
        <GetQuotes xmlns="http://www.carletoninc.com/calcs/lease">
            <parameters>
                @foreach($quotes as $quote)
                <QuoteParameters>
                    <Taxes>
                        <Tax>
                            <Rate>{{$quote['taxRate']}}</Rate>
                        </Tax>
                    </Taxes>
                    <Fees>
                        @foreach($quote['fees'] as $fee)
                        <Fee>
                            @foreach($fee as $attr => $value)
                            <{{$attr}}>{{$value}}</{{$attr}}>
                            @endforeach
                        </Fee>
                        @endforeach
                    </Fees>
                    <UserCode>SS00000000000001</UserCode>
                    <MoneyFactor>{{$quote['moneyFactor']}}</MoneyFactor>
                    <CashAdvance>{{$quote['cashAdvance']}}</CashAdvance>
                    <ResidualPercentage>{{$quote['residualPercent']}}</ResidualPercentage>
                    <MSRP>{{$quote['msrp']}}</MSRP>
                    <SolveFor>Payment</SolveFor>
                    <Term>{{$quote['term']}}</Term>
                    <LeaseType>MoneyFactor</LeaseType>
                    <FinanceTaxes>Yes</FinanceTaxes>
                    <ContractDate>{{$quote['contractDate']}}</ContractDate>
                    <UpfrontPayments>1</UpfrontPayments>
                    <TaxMethod>MonthlyUse</TaxMethod>
                    <ApplyCashDownToUpfront>No</ApplyCashDownToUpfront>
                    <ApplyRebateToUpfront>No</ApplyRebateToUpfront>
                    <ApplyNetTradeToUpfront>No</ApplyNetTradeToUpfront>
                    <TaxIndex>1</TaxIndex>
                    <RoundDepreciation>Near</RoundDepreciation>
                    <RoundRent>Low</RoundRent>
                    <CCRProcessingOrder>Rebate_CashDown_Trade</CCRProcessingOrder>
                    <PaymentFrequency>Monthly</PaymentFrequency>
                </QuoteParameters>
                @endforeach
            </parameters>
        </GetQuotes>
    </soap:Body>
</soap:Envelope>