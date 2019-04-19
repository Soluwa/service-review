Feature: Endpoint Errors

  @component
  Scenario: Error - Only 1 upload at a time

    Given I try to post multiple csv
    Then the response status should be 422
      And the response property "message" contains "Only 1 upload at a time"

  @component
  Scenario: Error - No file provided

    Given I try to post no csv
    Then the response status should be 422
      And the response property "message" contains "No file provided"

  @component
  Scenario: Error - Missing column SId

    Given I try to post "missingConvId" csv
    Then the response status should be 422
      And the response property "message" contains "Missing column Id"

  @component
  Scenario: Error - Exceeded max conversations of 500

    Given I try to post "501lines" csv
    Then the response status should be 422
      And the response property "message" contains "Exceeded max conversations of 500"

  @component
  Scenario: Error - No conversations to create batch
  
    Given I try to post "0lines" csv
    Then the response status should be 422
      And the response property "message" contains "No conversations to create batch"

  @component
  Scenario: Error - Could not find any valid records
  
    Given I try to post "invalidConvId" csv
    Then the response status should be 422
      And the response property "message" contains "Could not find any valid records"

  @component
  Scenario: Error - ConvId not found on single search

    When I try to search for convId "test123"
    Then the response status should be 422
      And the response property "message" contains "Could not find any valid records"