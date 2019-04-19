Feature: Review conversations

  @component
  Scenario Outline: Review Conversation - intentUnderstood <intentUnderstood>, topicUnderstood <topicUnderstood>, conversationUnderstandable <conversationUnderstandable>, multipleIntents "<multipleIntents>", followUpQuestion "<followUpQuestion>", outOfScope "<outOfScope>", expectedPerformance <expectedPerformance>, areaForImprovement "<areaForImprovement>", otherReason "<otherReason>", conversationRating "<conversationRating>", tags "<tags>"

    Given I delete documents with convId "review" from "cbaas-conversation" db
    Given I delete documents with convId "review" from "cbaas-review" db
    When I create 1 record with convId "review" via context service
      And I try to post "reviewRecord1" csv
    Then the response status should be 200
      And the response body property "batch.conversations" is an array
      And the property "batch.id" will be "defined"
      And the property "batch.conversations[0].firstTurn" will be "defined"
      And the property "batch.conversations[0].reviewStatus" will be "defined"
      And the response property "batch.conversations[0].convId" contains "review"
      And the property "batch.conversations[0].reviewStatus" will be "false"
    When I try to authenticate with valid credentials
    Then I review the convId "review" with intentUnderstood <intentUnderstood>, topicUnderstood <topicUnderstood>, conversationUnderstandable <conversationUnderstandable>, multipleIntents "<multipleIntents>", followUpQuestion "<followUpQuestion>", outOfScope "<outOfScope>", expectedPerformance <expectedPerformance>, areaForImprovement "<areaForImprovement>", otherReason "<otherReason>", conversationRating "<conversationRating>", tags "<tags>"
      And the response status should be 200
    When I try to post "reviewRecord1" csv
    Then the response status should be 200
      And the response property "batch.conversations[0].convId" contains "review"
      And the property "batch.conversations[0].reviewStatus" will be "true"
    Given I view review data for convId "review" from "cbaas-review" db
    Then the response status should be 200
      And the response property "[0].intentUnderstood" contains "<intentUnderstood>"
      And the response property "[0].topicUnderstood" contains "<topicUnderstood>"
      And the response property "[0].conversationUnderstandable" contains "<conversationUnderstandable>"
      And the property "[0].multipleIntents" will be "<multipleIntents>"
      And the property "[0].followUpQuestion" will be "<followUpQuestion>"
      And the property "[0].outOfScope" will be "<outOfScope>"
      And the response property "[0].areaForImprovement" array includes "<areaForImprovement>"
      And the response property "[0].otherReason" contains "<otherReason>"
      And the response property "[0].conversationRating" contains "<conversationRating>"
      And the response property "[0].tags" array includes "<tags>"
    Then I delete documents with convId "review" from "cbaas-conversation" db
    Then I delete documents with convId "review" from "cbaas-review" db

    Examples:
      | intentUnderstood | topicUnderstood | conversationUnderstandable | multipleIntents | followUpQuestion | outOfScope | expectedPerformance | areaForImprovement                                   | otherReason | conversationRating | tags           |
      | 1                | 1               | 1                          | true            | true             | true       | 1                   | misclassification,improvement,other,defect,newIntent | fish        | Good               | tag1,tag2,tag3 |
      | 0                | 0               | 0                          | false           | false            | false      | 0                   | misclassification,improvement,defect,newIntent       |             | Good               | tag            |


  @component
  Scenario: Update Review Conversation

    Given I delete documents with convId "review" from "cbaas-conversation" db
    Given I delete documents with convId "review" from "cbaas-review" db
    When I create 1 record with convId "review" via context service
      And I try to post "reviewRecord1" csv
    Then the response status should be 200
      And the response body property "batch.conversations" is an array
      And the property "batch.id" will be "defined"
      And the property "batch.conversations[0].firstTurn" will be "defined"
      And the property "batch.conversations[0].reviewStatus" will be "defined"
      And the response property "batch.conversations[0].convId" contains "review"
      And the property "batch.conversations[0].reviewStatus" will be "false"
    When I try to authenticate with valid credentials
    Then I review the convId "review" with intentUnderstood 1, topicUnderstood 1, conversationUnderstandable 1, multipleIntents "true", followUpQuestion "true", outOfScope "true", expectedPerformance 1, areaForImprovement "Other", otherReason "Sort it out", conversationRating "Good", tags "This is a tag, SoIsThis"
      And the response status should be 200
    When I try to post "reviewRecord1" csv
    Then the response status should be 200
      And the response property "batch.conversations[0].convId" contains "review"
      And the property "batch.conversations[0].reviewStatus" will be "true"
    Given I view review data for convId "review" from "cbaas-review" db
    Then the response status should be 200
      And the response property "[0].intentUnderstood" contains "1"
      And the response property "[0].topicUnderstood" contains "1"
      And the response property "[0].conversationUnderstandable" contains "1"
      And the property "[0].multipleIntents" will be "true"
      And the property "[0].followUpQuestion" will be "true"
      And the property "[0].outOfScope" will be "true"
      And the response property "[0].areaForImprovement" array includes "Other"
      And the response property "[0].otherReason" contains "Sort it out"
      And the response property "[0].conversationRating" contains "Good"
      And the response property "[0].tags" array includes "This is a tag, SoIsThis"
    Then I update the convId "review" with intentUnderstood 0, topicUnderstood 0, conversationUnderstandable 0, multipleIntents "false", followUpQuestion "false", outOfScope "false", expectedPerformance 0, areaForImprovement "Other", otherReason "Its Sorted", conversationRating "Bad", tags "TagUpdate"
      And the response status should be 200
    Then the response property "conversationRating" contains "Bad"
      And the response property "intentUnderstood" contains "0"
      And the response property "topicUnderstood" contains "0"
      And the response property "conversationUnderstandable" contains "0"
      And the property "multipleIntents" will be "false"
      And the property "followUpQuestion" will be "false"
      And the property "outOfScope" will be "false"
      And the response property "areaForImprovement" array includes "Other"
      And the response property "otherReason" contains "Its Sorted"
      And the response property "tags" array includes "TagUpdate"
      And the id has been updated
    Then I delete documents with convId "review" from "cbaas-conversation" db
    Then I delete documents with convId "review" from "cbaas-review" db