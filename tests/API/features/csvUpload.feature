Feature: CSV Uploads

  @component
  Scenario: CSV Upload with valid record

    Given I create 1 record with convId "test" via context service
    When I try to post "validConvId" csv
    Then the response status should be 200
      And the response body property "batch.conversations" is an array
      And the property "batch.id" will be "defined"
      And the property "batch.conversations[0].firstTurn" will be "defined"
      And the property "batch.conversations[0].reviewStatus" will be "defined"
      And the response property "batch.conversations[0].convId" contains "test"
    Given I view review data for convId "test" from "cbaas-review" db  
    Then I delete documents with convId "test" from "cbaas-conversation" db
    Then I delete documents with convId "test" from "cbaas-review" db

  @component
  Scenario: CSV Upload with valid record and missing record

    Given I create 1 record with convId "test" via context service
    When I try to post "validAndMissingConvId" csv
    Then the response status should be 200
      And the response property "batch.conversations[0].convId" contains "test"
      And the response property "missing" contains "missing"
    Given I view review data for convId "test" from "cbaas-review" db  
    Then I delete documents with convId "test" from "cbaas-conversation" db
    Then I delete documents with convId "test" from "cbaas-review" db

  @component
  Scenario: CSV Upload with extra tableau data

    Given I create 1 record with convId "test" via context service
    When I try to post "tableauExtractExample" csv
    Then the response status should be 200
      And the response body property "batch.conversations" is an array
      And the response conversations array contains 1 record
      And the response property "batch.conversations[0].convId" contains "test"
    Given I view review data for convId "test" from "cbaas-review" db  
    Then I delete documents with convId "test" from "cbaas-conversation" db
    Then I delete documents with convId "test" from "cbaas-review" db

  @component
  Scenario: CSV Upload with duplicate records

    Given I create 1 record with convId "test" via context service
    When I try to post "duplicateLines" csv
    Then the response status should be 200
      And the response body property "batch.conversations" is an array
      And the response conversations array contains 1 record
      And the response property "batch.conversations[0].convId" contains "test"
    Given I view review data for convId "test" from "cbaas-review" db  
    Then I delete documents with convId "test" from "cbaas-conversation" db
    Then I delete documents with convId "test" from "cbaas-review" db


  @component
  Scenario: CSV Upload 500 line csv

    Given I create 500 records with convId "test" via context service
    When I try to post "500lines" csv
    Then the response status should be 200
      And the response body property "batch.conversations" is an array
      And the response conversations array contains 500 records
      And the response property "batch.conversations[0].convId" contains "test-1"
      And the response property "batch.conversations[499].convId" contains "test-500"
    Given I view review data for convId "test" from "cbaas-review" db  
    Then I delete documents with convId "test" from "cbaas-conversation" db
    Then I delete documents with convId "test" from "cbaas-review" db

  @component
  Scenario: Single batch using the "search"

    Given I create 1 record with convId "test123" via context service
    And I try to search for convId "test123"
    Then the response status should be 200
      And the response body property "batch.conversations" is an array
      And the response property "batch.conversations[0].convId" contains "test123"
    Given I view review data for convId "test123" from "cbaas-review" db  
    Then I delete documents with convId "test123" from "cbaas-conversation" db
    Then I delete documents with convId "test123" from "cbaas-review" db  