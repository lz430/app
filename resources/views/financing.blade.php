@extends('layouts.app')

@section('content')
    <Financing></Financing>


    {{--// open up to this page, iframe, start financing -- sends as POST over to trigger of financing process--}}
    {{--// OR--}}
    {{--// Big button at the top that says "no thanks, I'm going to pay cash"--}}

    {{--// has an iframe, the contents of which are another frame on our site--}}
    {{--// this page is a giant button that says "start financing", no thanks--}}
    {{--// JS to monitor URL of iframe so when it gets to done state, move to a next page?--}}
    {{--// When it's done, move them onto the thank you page. It will do a POST back to our site, it captures information--}}



    {{--<form id="oemWaoSample" method="post" target="_blank">--}}
        {{--<br><table>--}}
            {{--<tbody>--}}
            {{--<tr>--}}
                {{--<td>--}}
                    {{--Consumer First Name:--}}
                {{--</td>--}}
                {{--<td>--}}
                    {{--<input type="text" name="first_name" value="Roger">--}}
                {{--</td>--}}
            {{--</tr>--}}
            {{--<tr>--}}
                {{--<td>--}}
                    {{--Consumer Last Name:--}}
                {{--</td>--}}
                {{--<td>--}}
                    {{--<input type="text" name="last_name" value="Simmons">--}}
                {{--</td>--}}
            {{--</tr>--}}
            {{--<tr>--}}
                {{--<td>--}}
                    {{--Consumer Zip:--}}
                {{--</td>--}}
                {{--<td>--}}
                    {{--<input type="text" name="zip" value="90201">--}}
                {{--</td>--}}
            {{--</tr>--}}
            {{--<tr>--}}
                {{--<td>--}}
                    {{--Vehicle Year:--}}
                {{--</td>--}}
                {{--<td>--}}
                    {{--<select name="vehicleYear" id="vehicleYear" ><option value="2012">Make Selection</option>--}}
                        {{--<option value="2017" selected>2017</option>--}}
                        {{--<option value="2016">2016</option>--}}
                        {{--<option value="2015">2015</option>--}}
                        {{--<option value="2014">2014</option>--}}
                        {{--<option value="2013">2013</option>--}}
                        {{--<option value="2012">2012</option>--}}
                        {{--<option value="2011">2011</option>--}}
                        {{--<option value="2010">2010</option>--}}
                        {{--<option value="2009">2009</option>--}}
                        {{--<option value="2008">2008</option>--}}
                        {{--<option value="2007">2007</option>--}}
                        {{--<option value="2006">2006</option>--}}
                        {{--<option value="2005">2005</option>--}}
                        {{--<option value="2004">2004</option>--}}
                        {{--<option value="2003">2003</option>--}}
                        {{--<option value="2002">2002</option>--}}
                        {{--<option value="2001">2001</option>--}}
                        {{--<option value="2000">2000</option>--}}
                        {{--<option value="1999">1999</option>--}}
                        {{--<option value="1998">1998</option>--}}
                        {{--<option value="1997">1997</option>--}}
                        {{--<option value="1996">1996</option>--}}
                    {{--</select>--}}
                {{--</td>--}}
            {{--</tr>--}}
            {{--<tr>--}}
                {{--<td>--}}
                    {{--Vehicle Make:--}}
                {{--</td>--}}
                {{--<td>--}}
                    {{--<input type="text" name="vehicleMake" value="Ford">--}}
                {{--</td>--}}
            {{--</tr>--}}
            {{--<tr>--}}
                {{--<td>--}}
                    {{--Vehicle Model:--}}
                {{--</td>--}}
                {{--<td>--}}
                    {{--<input type="text" name="vehicleModel" value="C-Max Hybrid">--}}
                {{--</td>--}}
            {{--</tr>--}}
            {{--<tr>--}}
                {{--<td>--}}
                    {{--Vehicle Style:--}}
                {{--</td>--}}
                {{--<td>--}}
                    {{--<input type="text" name="contractTerms_vehiclestyle" value="SE FWD">--}}
                {{--</td>--}}
            {{--</tr>--}}
            {{--<tr>--}}
                {{--<td>--}}
                    {{--Vehicle VIN:--}}
                {{--</td>--}}
                {{--<td>--}}
                    {{--<input type="text" name="vehicle_vin" value="12323312312">--}}
                {{--</td>--}}
            {{--</tr>--}}
            {{--<tr>--}}
                {{--<td>--}}
                    {{--MSRP/Retail:--}}
                {{--</td>--}}
                {{--<td>--}}
                    {{--<input type="text" name="contractTerms_msrp" value="32999">--}}
                {{--</td>--}}
            {{--</tr>--}}
            {{--<tr>--}}
                {{--<td>--}}
                    {{--Vehicle Image URL:--}}
                {{--</td>--}}
                {{--<td>--}}
                    {{--<input type="text" name="vehicle_image_url" value="https://www.hmfusa.com/Data/Teamsite/HCA/HMF/img/MyAccount/HMF_Azera_2013.png">--}}
                {{--</td>--}}
            {{--</tr>--}}
            {{--<tr>--}}
                {{--<td>--}}
                    {{--Dealership Name:--}}
                {{--</td>--}}
                {{--<td>--}}
                    {{--<input type="text" name="dealership_name" value="Galpin Ford">--}}
                {{--</td>--}}
            {{--</tr>--}}
            {{--<tr>--}}
                {{--<td>--}}
                    {{--Dealership Address:--}}
                {{--</td>--}}
                {{--<td>--}}
                    {{--<input type="text" name="dealership_address" value="15505 Roscoe Blvd.">--}}
                {{--</td>--}}
            {{--</tr>--}}
            {{--<tr>--}}
                {{--<td>--}}
                    {{--Dealership City:--}}
                {{--</td>--}}
                {{--<td>--}}
                    {{--<input type="text" name="dealership_city" value="North Hills">--}}
                {{--</td>--}}
            {{--</tr>--}}
            {{--<tr>--}}
                {{--<td>--}}
                    {{--Dealership State:--}}
                {{--</td>--}}
                {{--<td>--}}
                    {{--<select name="dealership_state" tabindex="7" id="dealership_state" ><option value="-1">Make Selection</option>--}}
                        {{--<option value="AL">Alabama</option>--}}
                        {{--<option value="AK">Alaska</option>--}}
                        {{--<option value="AZ">Arizona</option>--}}
                        {{--<option value="AR">Arkansas</option>--}}
                        {{--<option value="AE">Armed Forces Africa/Canada/Europe/Middle East</option>--}}
                        {{--<option value="AA">Armed Forces Americas</option>--}}
                        {{--<option value="AP">Armed Forces Pacific</option>--}}
                        {{--<option value="CA">California</option>--}}
                        {{--<option value="CO">Colorado</option>--}}
                        {{--<option value="CT">Connecticut</option>--}}
                        {{--<option value="DE">Delaware</option>--}}
                        {{--<option value="DC">District of Columbia</option>--}}
                        {{--<option value="FL">Florida</option>--}}
                        {{--<option value="GA">Georgia</option>--}}
                        {{--<option value="GU">Guam</option>--}}
                        {{--<option value="HI">Hawaii</option>--}}
                        {{--<option value="ID">Idaho</option>--}}
                        {{--<option value="IL">Illinois</option>--}}
                        {{--<option value="IN">Indiana</option>--}}
                        {{--<option value="IA">Iowa</option>--}}
                        {{--<option value="KS">Kansas</option>--}}
                        {{--<option value="KY">Kentucky</option>--}}
                        {{--<option value="LA">Louisiana</option>--}}
                        {{--<option value="ME">Maine</option>--}}
                        {{--<option value="MD">Maryland</option>--}}
                        {{--<option value="MA">Massachusetts</option>--}}
                        {{--<option value="MI" selected>Michigan</option>--}}
                        {{--<option value="MN">Minnesota</option>--}}
                        {{--<option value="MS">Mississippi</option>--}}
                        {{--<option value="MO">Missouri</option>--}}
                        {{--<option value="MT">Montana</option>--}}
                        {{--<option value="NE">Nebraska</option>--}}
                        {{--<option value="NV">Nevada</option>--}}
                        {{--<option value="NH">New Hampshire</option>--}}
                        {{--<option value="NJ">New Jersey</option>--}}
                        {{--<option value="NM">New Mexico</option>--}}
                        {{--<option value="NY">New York</option>--}}
                        {{--<option value="NC">North Carolina</option>--}}
                        {{--<option value="ND">North Dakota</option>--}}
                        {{--<option value="OH">Ohio</option>--}}
                        {{--<option value="OK">Oklahoma</option>--}}
                        {{--<option value="OR">Oregon</option>--}}
                        {{--<option value="PA">Pennsylvania</option>--}}
                        {{--<option value="PR">Puerto Rico</option>--}}
                        {{--<option value="RI">Rhode Island</option>--}}
                        {{--<option value="SC">South Carolina</option>--}}
                        {{--<option value="SD">South Dakota</option>--}}
                        {{--<option value="TN">Tennessee</option>--}}
                        {{--<option value="TX">Texas</option>--}}
                        {{--<option value="UT">Utah</option>--}}
                        {{--<option value="VT">Vermont</option>--}}
                        {{--<option value="VI">Virgin Islands</option>--}}
                        {{--<option value="VA">Virginia</option>--}}
                        {{--<option value="WA">Washington</option>--}}
                        {{--<option value="WV">West Virginia</option>--}}
                        {{--<option value="WI">Wisconsin</option>--}}
                        {{--<option value="WY">Wyoming</option>--}}
                    {{--</select>--}}
                {{--</td>--}}
            {{--</tr>--}}
            {{--<tr>--}}
                {{--<td>--}}
                    {{--Dealership Zip:--}}
                {{--</td>--}}
                {{--<td>--}}
                    {{--<input type="text" name="dealership_zip" value="91343">--}}
                {{--</td>--}}
            {{--</tr>--}}
            {{--<tr>--}}
                {{--<td>--}}
                    {{--Dealership Phone:--}}
                {{--</td>--}}
                {{--<td>--}}
                    {{--<input type="text" name="dealership_phone" value="888-288-8517">--}}
                {{--</td>--}}
            {{--</tr>--}}
            {{--<tr>--}}
                {{--<td>--}}
                    {{--Dealership Contact Name:--}}
                {{--</td>--}}
                {{--<td>--}}
                    {{--<input type="text" name="dealership_contact_name" value="Galpin Ford">--}}
                {{--</td>--}}
            {{--</tr>--}}
            {{--<tr>--}}
                {{--<td>--}}
                    {{--Dealership Website:--}}
                {{--</td>--}}
                {{--<td>--}}
                    {{--<input type="text" name="dealership_website" value="http://www.galpinford.com/">--}}
                {{--</td>--}}
            {{--</tr>--}}
            {{--<tr>--}}
                {{--<td>--}}
                    {{--Dealership Email:--}}
                {{--</td>--}}
                {{--<td>--}}
                    {{--<input type="text" name="dealership_email" value="dealer@fake.com">--}}
                {{--</td>--}}
            {{--</tr>--}}
            {{--<tr>--}}
                {{--<td>--}}
                    {{--Selected Partner Dealer(Hidden Parameter):--}}
                {{--</td>--}}
                {{--<td>--}}
                    {{--<input type="text" name="partnerDealerId" value="">--}}
                {{--</td>--}}
            {{--</tr>--}}
            {{--<tr>--}}
                {{--<td>--}}
                    {{--Selected RouteOne Dealer(Hidden Parameter):--}}
                {{--</td>--}}
                {{--<td>--}}
                    {{--<input type="text" name="dealerId" value="AX0PG">--}}
                {{--</td>--}}
            {{--</tr>--}}
            {{--<tr>--}}
                {{--<td>--}}
                    {{--Selected Finance Source(Hidden Parameter):--}}
                {{--</td>--}}
                {{--<td>--}}
                    {{--<input type="text" name="fncSrcId">--}}
                {{--</td>--}}
            {{--</tr>--}}
            {{--</tr>--}}
            {{--</tbody></table>--}}
        {{--<br>--}}
        {{--<input type="button" onclick="javascript:doSubmit();" value="Submit" >--}}
        {{--<br>--}}
    {{--</form>--}}

@endsection
