// ==UserScript==
// @name          eBay Auto Feedback Revisited
// @namespace     https://openuserjs.org/users/moped
// @license       GPL-3.0+; http://www.gnu.org/licenses/gpl-3.0.txt
// @copyright     Dec 19, 2005, Blake West
// @copyright     Nov 11, 2017, moped
// @author        moped
// @description   Fetches random feedback from The eBay Feedback Generator (http://thesurrealist.co.uk/feedback) and fills in the comment field on eBay feedback pages.
// @include       https://www.ebay.com/fdbk/*
// @include       https://www.ebay.co.uk/fdbk/*
// @version       1.0.1
// @connect       thesurrealist.co.uk
// @grant         GM_xmlhttpRequest
// ==/UserScript==

//***Configuration***
var frivolous = false; //set to true if you want frivolous vocabulary
var quality   = true;  //set to true to enable content about item quality in message
var packing   = false; //set to true to enable content about item packaginging in message
var speed     = false; //set to true to enable content about item speed in message
var rating    = true;  //set to true to enable content about rating in message
//******************

//***Init***
var commentField = document.querySelectorAll('[name=OVERALL_EXPERIENCE_COMMENT]');
if(commentField) addCommentLink();

//***Fetch feedback***
function getFeedback(e) {
  var experience_name = e.target.getAttribute('name').replace(/PARTY/,'OVERALL_EXPERIENCE');
  var commentFieldId = e.target.getAttribute('name').replace(/PARTY/,'pnnComment');
  var mood_radio = document.querySelector('[name='+experience_name+']:checked');
  var party_name = e.target.getAttribute('name');
  var party = e.target.value;
  if(mood_radio === null) {
    alert('Please select a Positive, Negative or Neutral rating, and try fetching a message again.');
    return false;
  }
  else {
    switch(mood_radio.value) {
      case 'NEGATIVE':
        mood = 'negative';
        break;
      case 'NEUTRAL':
        mood = 'indifferent';
        break;
      default:
        mood = 'positive';
    }
    var currentCommentInput = document.getElementById(commentFieldId);
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'http://thesurrealist.co.uk/feedback?who='+party+(quality?'&quality=on':'')+(speed?'&speed=on':'')+(packing?'&packing=on':'')+(rating?'&rating=on':'')+'&maxlen=79&mood='+mood+(frivolous?'&vocab=frivolous':'&vocab=basic'),
      onreadystatechange: function(responseDetails) {
          currentCommentInput.value = 'Fetching comment...';
      },
      onerror: function(responseDetails) {
          currentCommentInput.value = 'Error fetching comment...';
      },
      onload: function(responseDetails) {
        var details = responseDetails.responseText;
        var tt = details.slice(details.indexOf('<tt>')+4,details.indexOf('</tt>'));
        var feedback = tt.split('<br>');
        currentCommentInput.value = feedback[0].trim();
        currentCommentInput.focus();
      }
    });
  }
}

//***Add new elements to page***
function addCommentLink() {
  var blocks = document.querySelectorAll('div.feedback_template');
  for(i=0;i<blocks.length;i++) {
    var wrapper = document.createElement('div');
    var item_transaction = blocks[i].getAttribute('id').replace(/single-feedback-template-module/, '');
    wrapper.setAttribute('id', 'OVERALL_EXPERIENCE_PARTY-'+item_transaction);
    wrapper.setAttribute('class', 'section pnn_section');
    wrapper.innerHTML = '<div class="grid__group grid__group-sm"><div class="grid__cell grid__cell--two-fifth grid__cell--all"></div><div class="grid__cell grid__cell--three-fifth grid__cell--all"></div></div>';
    var wrapper_nodes = wrapper.firstChild.childNodes;
    wrapper_nodes[0].innerHTML = '<p class="section-title">Feedback is intended for?</p><p class="section-subtitle">Select who you are giving feedback to.</p>';
    wrapper_nodes[1].innerHTML = '<fieldset class="no-style-fieldset otdRadioGroup">'+
      '<input type="radio" value="seller" class="rating_radio" id="OVERALL_EXPERIENCE_PARTY_SELLER'+item_transaction+'" name="PARTY'+item_transaction+'">' +
      '<label for="OVERALL_EXPERIENCE_PARTY_SELLER'+item_transaction+'">Seller</label>' +
      '<input type="radio" value="buyer" class="rating_radio" id="OVERALL_EXPERIENCE_PARTY_BUYER'+item_transaction+'" name="PARTY'+item_transaction+'">' +
      '<label for="OVERALL_EXPERIENCE_PARTY_BUYER'+item_transaction+'">Buyer</label>' +
    '</fieldset>';
    var current = document.querySelector('div#OVERALL_EXPERIENCE_COMMENT_MODULE'+item_transaction);
    current.parentNode.insertBefore(wrapper, current);
  }
  var radios = document.querySelectorAll('.rating_radio');
  for(i=0;i<radios.length;i++) {
    radios[i].addEventListener('click',getFeedback,false);
  }
}